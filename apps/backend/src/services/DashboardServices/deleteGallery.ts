import { db } from "./_shared";
import { enqueuePhotoCleanup } from "../../queues/photoQueue";
import { removeStorage } from "../StorageServices";

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
          totalSize: true,
        },
      },
    },
  });
  if (!existing) {
    return false;
  }

  const totalBytes = existing.photos.reduce(
    (sum: bigint, photo: { totalSize?: bigint | number | string | null }) =>
      sum + BigInt(photo.totalSize ?? 0),
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
