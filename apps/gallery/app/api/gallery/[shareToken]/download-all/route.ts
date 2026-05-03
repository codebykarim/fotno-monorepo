import { getGalleryByShareToken } from "@/lib/gallery-service";
import { getDashboardGalleryAccessBySlug } from "@/lib/dashboard-gallery";
import { verifyGallerySessionToken } from "@/lib/gallery-session";
import { buildPhotoZipStream, slugifyForFilename } from "@/lib/zip-stream";
import type { PublicAlbum, PublicPhoto } from "@/lib/gallery-types";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type DownloadScope = {
  photoIds?: string[];
  albumId?: string;
};

const resolvePhotos = (
  scope: DownloadScope,
  gallery: { photos: PublicPhoto[]; albums?: PublicAlbum[] },
): { photos: PublicPhoto[]; filenameSuffix: string } => {
  if (scope.albumId) {
    const album = gallery.albums?.find((a) => a.id === scope.albumId);
    if (!album) {
      throw new Error("Album not found");
    }
    if (!album.downloadEnabled) {
      throw new Error("Downloads are disabled for this album");
    }
    const albumSet = new Set(album.photoIds);
    return {
      photos: gallery.photos.filter((p) => albumSet.has(p.id)),
      filenameSuffix: slugifyForFilename(album.title),
    };
  }

  if (scope.photoIds && scope.photoIds.length > 0) {
    const requested = new Set(scope.photoIds);
    return {
      photos: gallery.photos.filter((p) => requested.has(p.id)),
      filenameSuffix: "selection",
    };
  }

  return { photos: gallery.photos, filenameSuffix: "" };
};

const handle = async (
  request: NextRequest,
  shareToken: string,
  scope: DownloadScope,
) => {
  const authHeader = request.headers.get("authorization") ?? undefined;
  const galleryJwt = authHeader?.replace(/^Bearer\s+/i, "") || undefined;
  const sessionToken = request.headers.get("x-gallery-session");

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

  const { gallery } = await getGalleryByShareToken(shareToken, {
    galleryJwt,
    cache: "no-store",
  });

  if (gallery.hasPassword && !galleryJwt) {
    return NextResponse.json(
      { error: "Gallery is locked. Unlock first." },
      { status: 401 },
    );
  }

  if (gallery.photos.length === 0) {
    return NextResponse.json({ error: "No photos found" }, { status: 404 });
  }

  const { photos, filenameSuffix } = resolvePhotos(scope, gallery);

  if (photos.length === 0) {
    return NextResponse.json(
      { error: "No photos in selection" },
      { status: 404 },
    );
  }

  const webStream = buildPhotoZipStream({
    photos,
    shareToken,
    galleryJwt,
    signal: request.signal,
  });

  const baseName = slugifyForFilename(gallery.title);
  const fileName = filenameSuffix
    ? `${baseName}-${filenameSuffix}.zip`
    : `${baseName}.zip`;

  return new NextResponse(webStream as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
};

const parseScopeFromQuery = (request: NextRequest): DownloadScope => {
  const params = request.nextUrl.searchParams;
  const albumId = params.get("albumId") ?? undefined;
  const photoIdsRaw = params.get("photoIds");
  const photoIds = photoIdsRaw
    ? photoIdsRaw
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id.length > 0)
    : undefined;
  return { albumId, photoIds };
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shareToken: string }> },
) {
  try {
    const { shareToken } = await context.params;
    return await handle(request, shareToken, parseScopeFromQuery(request));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create download";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
