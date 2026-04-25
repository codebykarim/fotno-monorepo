import { getGalleryByShareToken, getPhotoPresignedUrl } from "@/lib/gallery-service";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore archiver does not ship bundled typings in this workspace.
import archiver from "archiver";
import { getDashboardGalleryAccessBySlug } from "@/lib/dashboard-gallery";
import { verifyGallerySessionToken } from "@/lib/gallery-session";
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

    archive.on("warning", (warning: unknown) => {
      console.warn("download-all warning", warning);
    });

    archive.on("error", (error: unknown) => {
      archiveStream.destroy(error instanceof Error ? error : undefined);
    });

    archive.pipe(archiveStream);

    const abortDownload = () => {
      archive.destroy();
      archiveStream.destroy();
    };
    request.signal.addEventListener("abort", abortDownload);

    void (async () => {
      try {
        for (const photo of gallery.photos) {
          if (request.signal.aborted) return;
          const signedUrl = await getPhotoPresignedUrl(
            photo.id,
            shareToken,
            "original",
            galleryJwt
          );

          const fileResponse = await fetch(signedUrl, {
            signal: request.signal,
          });
          if (!fileResponse.ok || !fileResponse.body) {
            throw new Error(`Unable to read ${photo.originalFilename}`);
          }

          archive.append(Readable.fromWeb(fileResponse.body as any), {
            name: safeFilename(photo.originalFilename),
          });
        }

        await archive.finalize();
      } catch (error) {
        if (request.signal.aborted) return;
        archive.destroy(error as Error);
      }
    })();

    const webStream = Readable.toWeb(archiveStream) as unknown as ReadableStream;

    return new NextResponse(webStream as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${slugify(gallery.title)}.zip"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create download";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
