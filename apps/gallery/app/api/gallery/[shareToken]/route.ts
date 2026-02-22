import { getGalleryByShareToken } from "@/lib/gallery-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shareToken: string }> }
) {
  try {
    const { shareToken } = await context.params;
    const authHeader = request.headers.get("authorization") ?? undefined;
    const galleryJwt = authHeader?.replace(/^Bearer\s+/i, "") || undefined;

    const data = await getGalleryByShareToken(shareToken, {
      galleryJwt,
      cache: "no-store",
    });

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load gallery";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
