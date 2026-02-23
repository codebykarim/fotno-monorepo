import { getPhotoPresignedUrl } from "@/lib/gallery-service";
import type { PhotoVariant } from "@/lib/gallery-types";
import { getDashboardGalleryAccessBySlug } from "@/lib/dashboard-gallery";
import { verifyGallerySessionToken } from "@/lib/gallery-session";
import { NextRequest, NextResponse } from "next/server";

const VALID_VARIANTS: PhotoVariant[] = ["thumbnail", "preview", "original"];

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ photoId: string }> }
) {
  try {
    const { photoId } = await context.params;
    const shareToken = request.nextUrl.searchParams.get("shareToken");
    const variant =
      (request.nextUrl.searchParams.get("variant") as PhotoVariant | null) ??
      "preview";
    const authHeader = request.headers.get("authorization") ?? undefined;
    const galleryJwt = authHeader?.replace(/^Bearer\s+/i, "") || undefined;
    const sessionToken =
      request.nextUrl.searchParams.get("sessionToken") ??
      request.headers.get("x-gallery-session");

    if (!shareToken) {
      return NextResponse.json(
        { error: "shareToken is required" },
        { status: 400 }
      );
    }

    if (!VALID_VARIANTS.includes(variant)) {
      return NextResponse.json({ error: "Invalid variant" }, { status: 400 });
    }

    if (variant !== "original") {
      return NextResponse.json(
        { error: "Preview access must go through protected proxy route" },
        { status: 403 }
      );
    }

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

    const url = await getPhotoPresignedUrl(photoId, shareToken, variant, galleryJwt);

    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch URL";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
