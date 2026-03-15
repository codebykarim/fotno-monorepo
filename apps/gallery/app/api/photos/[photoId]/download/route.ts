import { getPhotoPresignedUrl } from "@/lib/gallery-service";
import { getDashboardGalleryAccessBySlug } from "@/lib/dashboard-gallery";
import { verifyGallerySessionToken } from "@/lib/gallery-session";
import { NextRequest, NextResponse } from "next/server";

const sanitizeFileName = (value: string): string => {
  const trimmed = value.trim();
  const safe = trimmed.replace(/[^\w.\-() ]+/g, "_");
  return safe.length > 0 ? safe : "photo.jpg";
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ photoId: string }> },
) {
  try {
    const { photoId } = await context.params;
    const shareToken = request.nextUrl.searchParams.get("shareToken");
    const fileName = sanitizeFileName(
      request.nextUrl.searchParams.get("fileName") ?? "photo.jpg",
    );
    const authHeader = request.headers.get("authorization") ?? undefined;
    const galleryJwt = authHeader?.replace(/^Bearer\s+/i, "") || undefined;
    const sessionToken =
      request.nextUrl.searchParams.get("sessionToken") ??
      request.headers.get("x-gallery-session");

    if (!shareToken) {
      return NextResponse.json(
        { error: "shareToken is required" },
        { status: 400 },
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

    const variant = request.nextUrl.searchParams.get("variant") ?? "original";
    const validVariants = ["thumbnail", "preview", "original"] as const;
    const resolvedVariant = validVariants.includes(variant as any)
      ? (variant as (typeof validVariants)[number])
      : "original";

    const upstreamUrl = await getPhotoPresignedUrl(
      photoId,
      shareToken,
      resolvedVariant,
      galleryJwt,
    );
    const upstream = await fetch(upstreamUrl, { cache: "no-store" });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: "Unable to stream original image" }, { status: 502 });
    }

    const contentType =
      upstream.headers.get("content-type") ?? "application/octet-stream";
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Disposition", `attachment; filename="${fileName}"`);
    headers.set("Cache-Control", "private, no-store, max-age=0");

    return new NextResponse(upstream.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to download file";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
