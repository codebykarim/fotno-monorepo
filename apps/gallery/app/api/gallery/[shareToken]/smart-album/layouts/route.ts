import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shareToken: string }> },
) {
  const { shareToken } = await context.params;

  const response = await backendFetch(
    `/api/public/gallery/${encodeURIComponent(shareToken)}/smart-album/layouts`,
    { cache: "no-store" },
  );

  const body = await response.json();
  return NextResponse.json(body, { status: response.status });
}
