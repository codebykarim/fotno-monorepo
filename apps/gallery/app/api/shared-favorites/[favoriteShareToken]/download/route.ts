import { backendFetch } from "@/lib/backend";
import { buildPhotoZipStream, slugifyForFilename } from "@/lib/zip-stream";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ favoriteShareToken: string }> },
) {
  try {
    const { favoriteShareToken } = await context.params;

    const response = await backendFetch(
      `/api/public/shared-favorites/${encodeURIComponent(favoriteShareToken)}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Shared favorites not found" },
        { status: 404 },
      );
    }

    const data = (await response.json()) as {
      viewerName?: string;
      gallery?: {
        title?: string;
        shareToken?: string;
        settings?: { downloadEnabled?: boolean };
      };
      photos?: { id: string; originalFilename?: string }[];
    };

    if (data.gallery?.settings?.downloadEnabled === false) {
      return NextResponse.json(
        { error: "Downloads are disabled for this gallery" },
        { status: 403 },
      );
    }

    const galleryShareToken = data.gallery?.shareToken;
    if (!galleryShareToken) {
      return NextResponse.json(
        { error: "Invalid shared favorites" },
        { status: 400 },
      );
    }

    const photos = (data.photos ?? []).map((p) => ({
      id: p.id,
      originalFilename: p.originalFilename || `${p.id}.jpg`,
    }));

    if (photos.length === 0) {
      return NextResponse.json(
        { error: "No favorites to download" },
        { status: 404 },
      );
    }

    const webStream = buildPhotoZipStream({
      photos,
      shareToken: galleryShareToken,
      galleryJwt: undefined,
      signal: request.signal,
    });

    const gallerySlug = slugifyForFilename(data.gallery?.title ?? "gallery");
    const viewerSlug = slugifyForFilename(data.viewerName ?? "favorites");
    const fileName = `${gallerySlug}-${viewerSlug}-favorites.zip`;

    return new NextResponse(webStream as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create download";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
