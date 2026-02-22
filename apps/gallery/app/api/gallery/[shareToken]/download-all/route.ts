import { getGalleryByShareToken, getPhotoPresignedUrl } from "@/lib/gallery-service";
import archiver from "archiver";
import { NextRequest, NextResponse } from "next/server";
import { PassThrough, Readable } from "node:stream";

export const runtime = "nodejs";

const safeFilename = (name: string): string => {
  const cleaned = name.replace(/[^a-zA-Z0-9._-]/g, "_");
  return cleaned.length > 0 ? cleaned : "photo.jpg";
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "gallery";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shareToken: string }> }
) {
  try {
    const { shareToken } = await context.params;
    const authHeader = request.headers.get("authorization") ?? undefined;
    const galleryJwt = authHeader?.replace(/^Bearer\s+/i, "") || undefined;

    const { gallery } = await getGalleryByShareToken(shareToken, {
      galleryJwt,
      cache: "no-store",
    });

    if (gallery.hasPassword && !galleryJwt) {
      return NextResponse.json(
        { error: "Gallery is locked. Unlock first." },
        { status: 401 }
      );
    }

    if (gallery.photos.length === 0) {
      return NextResponse.json({ error: "No photos found" }, { status: 404 });
    }

    const archiveStream = new PassThrough();
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    archive.on("warning", (warning) => {
      console.warn("download-all warning", warning);
    });

    archive.on("error", (error) => {
      archiveStream.destroy(error);
    });

    archive.pipe(archiveStream);

    void (async () => {
      try {
        for (const photo of gallery.photos) {
          const signedUrl = await getPhotoPresignedUrl(
            photo.id,
            shareToken,
            "original",
            galleryJwt
          );

          const fileResponse = await fetch(signedUrl);
          if (!fileResponse.ok || !fileResponse.body) {
            throw new Error(`Unable to read ${photo.originalFilename}`);
          }

          archive.append(
            Readable.fromWeb(fileResponse.body as unknown as ReadableStream),
            {
              name: safeFilename(photo.originalFilename),
            }
          );
        }

        await archive.finalize();
      } catch (error) {
        archive.destroy(error as Error);
      }
    })();

    return new NextResponse(
      Readable.toWeb(archiveStream) as unknown as BodyInit,
      {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${slugify(gallery.title)}.zip"`,
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create download";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
