import { db } from "./_shared";
import { enqueuePhotoCleanup } from "../../queues/photoQueue";
import { removeStorage } from "../StorageServices";

/**
 * Deletes a gallery and all its photos: updates storage accounting, removes gallery and photos from DB,
 * and enqueues S3 cleanup for all original, thumbnail, and preview objects.
 * Returns false if the gallery was not found or not owned by the user.
 */
export const deleteGallery = async (userId: string, galleryId: string) => {
  const existing = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: {
      id: true,
      photos: {
        select: {
          id: true,
          s3Key: true,
          thumbnailKey: true,
          previewKey: true,
          originalSize: true,
          thumbnailSize: true,
          previewSize: true,
          totalSize: true,
        },
      },
    },
  });
  if (!existing) {
    return false;
  }

  const totalBytes = existing.photos.reduce(
    (
      sum: bigint,
      photo: {
        originalSize?: bigint | number | string | null;
        thumbnailSize?: bigint | number | string | null;
        previewSize?: bigint | number | string | null;
        totalSize?: bigint | number | string | null;
      },
    ) => {
      const fallbackTotal = BigInt(photo.totalSize ?? 0);
      const computedTotal =
        BigInt(photo.originalSize ?? 0) +
        BigInt(photo.thumbnailSize ?? 0) +
        BigInt(photo.previewSize ?? 0);
      return sum + (computedTotal > 0n ? computedTotal : fallbackTotal);
    },
    0n,
  );

  if (totalBytes > 0n) {
    await removeStorage(userId, totalBytes, "delete");
  }

  await db.gallery.delete({ where: { id: galleryId } });

  const keys = existing.photos.flatMap(
    (photo: {
      s3Key: string;
      thumbnailKey?: string | null;
      previewKey?: string | null;
    }) => [photo.s3Key, photo.thumbnailKey ?? "", photo.previewKey ?? ""],
  );

  if (keys.length > 0) {
    void enqueuePhotoCleanup(keys).catch((error) => {
      console.error(
        `Failed to enqueue gallery cleanup for ${galleryId}`,
        error,
      );
    });
  }

  return true;
};
