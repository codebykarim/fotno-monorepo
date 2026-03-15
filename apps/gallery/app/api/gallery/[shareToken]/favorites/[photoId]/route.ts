import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ shareToken: string; photoId: string }> },
) {
  const { shareToken, photoId } = await context.params;
  const viewerId = request.nextUrl.searchParams.get("viewerId") ?? "";

  const response = await backendFetch(
    `/api/public/gallery/${encodeURIComponent(shareToken)}/favorites/${encodeURIComponent(photoId)}?viewerId=${encodeURIComponent(viewerId)}`,
    { method: "DELETE", cache: "no-store" },
  );

  const body = await response.json();
  return NextResponse.json(body, { status: response.status });
}
