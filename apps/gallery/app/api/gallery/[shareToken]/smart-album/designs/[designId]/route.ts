import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shareToken: string; designId: string }> },
) {
  const { shareToken, designId } = await context.params;

  const response = await backendFetch(
    `/api/public/gallery/${encodeURIComponent(shareToken)}/smart-album/designs/${encodeURIComponent(designId)}`,
    { cache: "no-store" },
  );

  const body = await response.json();
  return NextResponse.json(body, { status: response.status });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ shareToken: string; designId: string }> },
) {
  const { shareToken, designId } = await context.params;
  const payload = await request.json().catch(() => null);

  const response = await backendFetch(
    `/api/public/gallery/${encodeURIComponent(shareToken)}/smart-album/designs/${encodeURIComponent(designId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );

  const body = await response.json();
  return NextResponse.json(body, { status: response.status });
}
