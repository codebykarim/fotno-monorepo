import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shareToken: string }> },
) {
  const { shareToken } = await context.params;
  const clientEmail = request.nextUrl.searchParams.get("clientEmail") ?? "";

  if (!clientEmail) {
    return NextResponse.json(
      { error: "clientEmail query parameter required" },
      { status: 400 },
    );
  }

  const response = await backendFetch(
    `/api/public/gallery/${encodeURIComponent(shareToken)}/smart-album/designs?clientEmail=${encodeURIComponent(clientEmail)}`,
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
    `/api/public/gallery/${encodeURIComponent(shareToken)}/smart-album/designs`,
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
