import { db } from "./_shared";
import { getPresignedDownloadUrl } from "../../utils/s3";

// Photos in "processing" state older than this are considered stuck
const STALE_THRESHOLD_MS = 3 * 60 * 1000; // 3 minutes

export const getGalleryProcessingStatus = async (
  userId: string,
  galleryId: string,
) => {
  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { id: true },
  });

  if (!gallery) {
    return null;
  }

  const counts = await db.photo.groupBy({
    by: ["status"],
    where: { galleryId },
    _count: { id: true },
  });

  const statusMap: Record<string, number> = {};
  for (const row of counts) {
    statusMap[row.status] = row._count.id;
  }

  const processed = statusMap["processed"] ?? 0;
  const failed = statusMap["failed"] ?? 0;
  const processing = statusMap["processing"] ?? 0;
  const uploaded = statusMap["uploaded"] ?? 0;
  const pending = statusMap["pending"] ?? 0;

  // Check for stuck "processing" photos (no updatedAt on Photo, so we
  // check createdAt — if a photo was created > 3 min ago and is still
  // "processing", the image processor should have handled it by now)
  let stuck = 0;
  if (processing > 0) {
    const staleBefore = new Date(Date.now() - STALE_THRESHOLD_MS);
    stuck = await db.photo.count({
      where: {
        galleryId,
        status: "processing",
        createdAt: { lt: staleBefore },
      },
    });
  }

  // Fetch details of failed photos so user can see which ones need re-upload
  let failedPhotos: { id: string; originalFilename: string; url: string }[] =
    [];
  if (failed > 0) {
    const failedRows = await db.photo.findMany({
      where: { galleryId, status: "failed" },
      select: { id: true, originalFilename: true, s3Key: true },
      orderBy: { createdAt: "asc" },
    });

    failedPhotos = await Promise.all(
      failedRows.map(async (p: { id: string; originalFilename: string; s3Key: string }) => ({
        id: p.id,
        originalFilename: p.originalFilename,
        url: await getPresignedDownloadUrl(p.s3Key, 3600),
      })),
    );
  }

  const inProgress = pending + uploaded + processing;
  const total = processed + failed + inProgress;

  return {
    total,
    processed,
    failed,
    inProgress,
    stuck,
    done: inProgress === 0,
    failedPhotos,
  };
};
