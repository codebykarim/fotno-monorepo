import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { broadcastComments } from "@/lib/gallery-runtime-store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ shareToken: string; commentId: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { shareToken, commentId } = await context.params;
  const payload = await request.json().catch(() => null);

  const response = await backendFetch(
    `/api/public/gallery/${encodeURIComponent(shareToken)}/comments/${encodeURIComponent(commentId)}/like`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );

  const body = await response.json();

  if (response.ok) {
    broadcastComments(shareToken, JSON.stringify(body));
  }

  return NextResponse.json(body, { status: response.status });
}
