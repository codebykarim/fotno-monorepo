import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

export const runtime = "nodejs";

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ shareToken: string; designId: string }> },
) {
  const { shareToken, designId } = await context.params;

  const response = await backendFetch(
    `/api/public/gallery/${encodeURIComponent(shareToken)}/smart-album/designs/${encodeURIComponent(designId)}/submit`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    },
  );

  const body = await response.json();
  return NextResponse.json(body, { status: response.status });
}
