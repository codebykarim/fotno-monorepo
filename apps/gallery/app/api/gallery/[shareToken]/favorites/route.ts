import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shareToken: string }> },
) {
  const { shareToken } = await context.params;
  const viewerId = request.nextUrl.searchParams.get("viewerId") ?? "";

  const response = await backendFetch(
    `/api/public/gallery/${encodeURIComponent(shareToken)}/favorites?viewerId=${encodeURIComponent(viewerId)}`,
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
    `/api/public/gallery/${encodeURIComponent(shareToken)}/favorites`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );

  const body = await response.json();
  return NextResponse.json(body, { status: response.status });
}
