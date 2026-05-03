import { getPhotoPresignedUrl } from "@/lib/gallery-service";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore archiver does not ship bundled typings in this workspace.
import archiver from "archiver";
import { PassThrough, Readable } from "node:stream";

export type ZipPhoto = { id: string; originalFilename: string };

const safeFilename = (name: string): string => {
  const cleaned = name.replace(/[^a-zA-Z0-9._-]/g, "_");
  return cleaned.length > 0 ? cleaned : "photo.jpg";
};

export const slugifyForFilename = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "gallery";

export const buildPhotoZipStream = (opts: {
  photos: ZipPhoto[];
  shareToken: string;
  galleryJwt?: string;
  signal: AbortSignal;
}): ReadableStream => {
  const { photos, shareToken, galleryJwt, signal } = opts;

  const archiveStream = new PassThrough();
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("warning", (warning: unknown) => {
    console.warn("download-zip warning", warning);
  });

  archive.on("error", (error: unknown) => {
    archiveStream.destroy(error instanceof Error ? error : undefined);
  });

  archive.pipe(archiveStream);

  const abortDownload = () => {
    archive.destroy();
    archiveStream.destroy();
  };
  signal.addEventListener("abort", abortDownload);

  void (async () => {
    try {
      for (const photo of photos) {
        if (signal.aborted) return;
        const signedUrl = await getPhotoPresignedUrl(
          photo.id,
          shareToken,
          "original",
          galleryJwt,
        );

        const fileResponse = await fetch(signedUrl, { signal });
        if (!fileResponse.ok || !fileResponse.body) {
          throw new Error(`Unable to read ${photo.originalFilename}`);
        }

        archive.append(Readable.fromWeb(fileResponse.body as any), {
          name: safeFilename(photo.originalFilename),
        });
      }

      await archive.finalize();
    } catch (error) {
      if (signal.aborted) return;
      archive.destroy(error as Error);
    }
  })();

  return Readable.toWeb(archiveStream) as unknown as ReadableStream;
};
