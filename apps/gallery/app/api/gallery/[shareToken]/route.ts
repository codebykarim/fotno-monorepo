import { getGalleryByShareToken } from "@/lib/gallery-service";
import { getDashboardGalleryAccessBySlug } from "@/lib/dashboard-gallery";
import { verifyGallerySessionToken } from "@/lib/gallery-session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shareToken: string }> }
) {
  try {
    const { shareToken } = await context.params;
    const authHeader = request.headers.get("authorization") ?? undefined;
    const galleryJwt = authHeader?.replace(/^Bearer\s+/i, "") || undefined;
    const sessionToken =
      request.headers.get("x-gallery-session") ??
      request.nextUrl.searchParams.get("sessionToken");

    const dashboardAccess = await getDashboardGalleryAccessBySlug(shareToken);
    if (dashboardAccess?.passwordEnabled) {
      if (!sessionToken) {
        return NextResponse.json({ error: "Gallery lock required" }, { status: 401 });
      }

      const validSession = verifyGallerySessionToken({
        token: sessionToken,
        shareToken,
        password: dashboardAccess.password,
      });

      if (!validSession) {
        return NextResponse.json({ error: "Session expired" }, { status: 401 });
      }
    }

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
