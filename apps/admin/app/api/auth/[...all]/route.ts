import { type NextRequest } from "next/server";

const BACKEND_URL = (
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000"
).replace(/\/$/, "");

/**
 * Proxy all /api/auth/* requests to the backend's better-auth endpoints.
 * This lets the admin app set its own session cookie on its own domain.
 */
async function handler(request: NextRequest) {
  const url = new URL(request.url);
  // Strip /api prefix since backend already has /api
  const backendPath = url.pathname; // e.g. /api/auth/sign-in/email
  const backendUrl = `${BACKEND_URL}${backendPath}${url.search}`;

  const headers = new Headers();
  // Forward relevant headers
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const origin = request.headers.get("origin");
  if (origin) headers.set("origin", origin);
  headers.set("accept", "application/json");

  const init: RequestInit = {
    method: request.method,
    headers,
    // @ts-expect-error - duplex needed for streaming request bodies
    duplex: "half",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
  }

  const res = await fetch(backendUrl, init);

  // Create response and forward set-cookie headers from backend
  const responseHeaders = new Headers();
  res.headers.forEach((value, key) => {
    // Forward all set-cookie headers so session works on admin domain
    if (key.toLowerCase() === "set-cookie" || key.toLowerCase() === "content-type") {
      responseHeaders.append(key, value);
    }
  });

  const body = await res.arrayBuffer();
  return new Response(body, {
    status: res.status,
    headers: responseHeaders,
  });
}

export const GET = handler;
export const POST = handler;
