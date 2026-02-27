# Real-Time Gallery Comments with SSE

## Overview

Gallery comments update in real-time using **Server-Sent Events (SSE)** -- a native browser API that opens a single persistent HTTP connection from the client to the server. When any viewer adds, edits, deletes, or likes a comment, every other viewer on that gallery sees the change instantly.

No WebSocket libraries, no polling, no third-party services.

---

## Architecture

There are 3 layers involved:

```
Browser (React)  -->  Gallery Next.js API routes  -->  Express backend (Prisma/DB)
```

- **Express backend** owns the database. It handles CRUD for comments and returns the full comment tree.
- **Gallery Next.js API routes** are thin proxies that forward mutations to the backend. They also manage the SSE connections and broadcast updates.
- **Browser** opens one `EventSource` connection per gallery and receives pushed updates.

### Flow diagram

```
  Client A (browser)          Gallery Next.js Server           Client B (browser)
  ==================          =====================           ==================

  1. Opens EventSource -----> SSE endpoint holds
     connection open                                   <----- Opens EventSource

  2. POST /comments --------> Proxy forwards to backend
                               Backend returns { comments }
                       <------ Response (instant to A)
                               broadcastComments() pushes
                               to all SSE listeners --------> SSE event received
                                                              setComments(new data)
```

Client A gets the response directly from their POST. Client B (and everyone else) gets the update through the SSE stream. No extra API calls.

---

## The 3 pieces

### 1. In-memory pub/sub (`gallery-runtime-store.ts`)

This is a simple global Map that tracks SSE listeners per gallery. It lives in the Next.js server's Node.js process memory (same pattern as the existing viewer presence tracking).

```typescript
// gallery-runtime-store.ts

type CommentListener = (data: string) => void;

// Global map: shareToken -> Set of listener functions
const getListeners = (): Map<string, Set<CommentListener>> => {
  const g = globalThis as typeof globalThis & {
    __fotnoCommentListeners?: Map<string, Set<CommentListener>>;
  };
  if (!g.__fotnoCommentListeners) {
    g.__fotnoCommentListeners = new Map();
  }
  return g.__fotnoCommentListeners;
};

// Subscribe: returns an unsubscribe function
export const subscribeComments = (
  shareToken: string,
  listener: CommentListener,
): (() => void) => {
  const map = getListeners();
  const set = map.get(shareToken) ?? new Set();
  set.add(listener);
  map.set(shareToken, set);

  return () => {
    set.delete(listener);
    if (set.size === 0) map.delete(shareToken);
  };
};

// Broadcast: push data string to all listeners for a gallery
export const broadcastComments = (shareToken: string, data: string): void => {
  const set = getListeners().get(shareToken);
  if (!set) return;
  for (const listener of set) {
    listener(data);
  }
};
```

**Why global?** Next.js API routes are isolated per-request. By storing the listeners on `globalThis`, all route handlers in the same Node.js process share the same Map. This is the same technique the viewer presence system uses.

---

### 2. SSE stream endpoint (`comments/stream/route.ts`)

This is the endpoint the browser connects to. It returns a `ReadableStream` that stays open indefinitely.

```typescript
// app/api/gallery/[shareToken]/comments/stream/route.ts

import { NextRequest } from "next/server";
import { subscribeComments } from "@/lib/gallery-runtime-store";

export const runtime = "nodejs"; // required for streaming

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shareToken: string }> },
) {
  const { shareToken } = await context.params;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Helper to send a named SSE event
      const send = (event: string, data: string) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${data}\n\n`)
        );
      };

      // Confirm connection
      send("connected", JSON.stringify({ ok: true }));

      // Subscribe to comment updates for this gallery
      const unsubscribe = subscribeComments(shareToken, (payload) => {
        send("comments", payload);
      });

      // Keep connection alive (browsers/proxies drop idle connections)
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keepalive\n\n"));
        } catch {
          clearInterval(keepAlive);
        }
      }, 25_000);

      // Clean up when client disconnects
      request.signal.addEventListener("abort", () => {
        unsubscribe();
        clearInterval(keepAlive);
        try { controller.close(); } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
```

**Key details:**
- `runtime = "nodejs"` is required. Edge runtime doesn't support long-lived streams well.
- SSE format is `event: name\ndata: payload\n\n`. The browser's `EventSource` parses this natively.
- `: keepalive\n\n` is an SSE comment (starts with `:`). Browsers ignore it but it prevents proxy timeouts.
- When the browser tab closes or navigates away, `request.signal` fires `abort`, and we clean up.

---

### 3. Mutation proxy routes broadcast after success

Every comment mutation (create, edit, delete, like) goes through a Next.js proxy route to the Express backend. After the backend responds successfully, the proxy broadcasts the updated comment tree to all SSE listeners.

```typescript
// app/api/gallery/[shareToken]/comments/route.ts (POST handler)

import { broadcastComments } from "@/lib/gallery-runtime-store";

export async function POST(request, context) {
  const { shareToken } = await context.params;
  const payload = await request.json();

  // Forward to Express backend
  const response = await backendFetch(
    `/api/public/gallery/${shareToken}/comments`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const body = await response.json();

  // If successful, broadcast to all SSE listeners for this gallery
  if (response.ok) {
    broadcastComments(shareToken, JSON.stringify(body));
  }

  return NextResponse.json(body, { status: response.status });
}
```

The same pattern is applied to PATCH (edit), DELETE, and POST like endpoints.

---

### 4. Browser client (`gallery-page-client.tsx`)

On mount, the component does two things:
1. One-time fetch to get the initial comment list
2. Opens an `EventSource` for live updates

```typescript
useEffect(() => {
  if (!isUnlocked) return;

  // 1. Initial load (one fetch, once)
  fetch(`/api/gallery/${gallery.shareToken}/comments`, { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (data?.comments) setComments(data.comments);
    })
    .catch(() => {});

  // 2. SSE connection for real-time updates
  const es = new EventSource(
    `/api/gallery/${gallery.shareToken}/comments/stream`,
  );

  es.addEventListener("comments", (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.comments) {
        setComments(data.comments);
      }
    } catch {}
  });

  return () => {
    es.close(); // clean up on unmount
  };
}, [isUnlocked, gallery.shareToken]);
```

**What about the caller's own mutations?** When you post a comment, the `fetch()` response already contains the updated comment list and calls `setComments()` directly. The SSE event arrives too, but React deduplicates the state update since it's the same data. So the caller sees their change instantly, and everyone else sees it via SSE.

---

## Why SSE and not WebSockets?

| | SSE | WebSockets |
|---|---|---|
| Direction | Server -> Client only | Bidirectional |
| Browser API | `EventSource` (built-in) | `WebSocket` (built-in) |
| Reconnection | Automatic (built into EventSource) | Manual |
| Protocol | Plain HTTP | Upgrade to ws:// |
| Works through proxies | Yes (it's just HTTP) | Sometimes blocked |
| Complexity | Very low | Medium |
| Libraries needed | None | None (or Socket.IO etc.) |

For this use case (server pushes comment updates to viewers), we only need server-to-client. SSE is the simplest option.

---

## What happens if the connection drops?

`EventSource` automatically reconnects. The browser will retry every few seconds (default ~3s) until it succeeds. When it reconnects, it opens a new SSE stream and starts receiving new events. The initial comment data was already loaded from the one-time fetch, so there's no gap.

---

## Memory / performance considerations

- Each open gallery tab holds one SSE connection (one entry in the listeners Set)
- The listeners Map is garbage collected when all viewers leave (the Set becomes empty and is deleted)
- The keepalive ping is 25s, tiny overhead
- No database queries happen on the SSE endpoint itself -- it only forwards data that the mutation routes already fetched
- Broadcasting is O(n) where n is the number of viewers on that specific gallery, which is typically very small
