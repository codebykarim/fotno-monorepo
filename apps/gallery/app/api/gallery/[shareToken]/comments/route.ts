import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { addComment, listComments } from "@/lib/gallery-runtime-store";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ shareToken: string }> },
) {
  const { shareToken } = await context.params;
  return NextResponse.json({ comments: listComments(shareToken) });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ shareToken: string }> },
) {
  const { shareToken } = await context.params;
  const body = (await request.json().catch(() => null)) as
    | {
        authorName?: string;
        message?: string;
        photoId?: string | null;
      }
    | null;

  const message = body?.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const authorName = body?.authorName?.trim() || "Client";

  const comments = addComment({
    id: crypto.randomUUID(),
    shareToken,
    authorName,
    message,
    photoId: body?.photoId ?? null,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ comments });
}
