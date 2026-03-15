import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ favoriteShareToken: string }> },
) {
  const { favoriteShareToken } = await context.params;

  const response = await backendFetch(
    `/api/public/shared-favorites/${encodeURIComponent(favoriteShareToken)}`,
    { cache: "no-store" },
  );

  const body = await response.json();
  return NextResponse.json(body, { status: response.status });
}
