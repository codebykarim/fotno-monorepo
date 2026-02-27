import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { broadcastComments } from "@/lib/gallery-runtime-store";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ shareToken: string }> },
) {
  const { shareToken } = await context.params;

  const response = await backendFetch(
    `/api/public/gallery/${encodeURIComponent(shareToken)}/comments`,
    { cache: "no-store" },
  );

  const body = await response.json();
  return NextResponse.json(body, { status: response.status });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ shareToken: string }> },
) {
  const { shareToken } = await context.params;
  const payload = await request.json().catch(() => null);

  const response = await backendFetch(
    `/api/public/gallery/${encodeURIComponent(shareToken)}/comments`,
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
