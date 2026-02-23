import { db } from "./_shared";
import { enqueuePhotoCleanup } from "../../queues/photoQueue";
import { removeStorage } from "../StorageServices";

export const deletePhoto = async (userId: string, photoId: string) => {
  const photo = await db.photo.findFirst({
    where: {
      id: photoId,
      gallery: {
        userId,
      },
    },
    select: {
      id: true,
      s3Key: true,
      thumbnailKey: true,
      previewKey: true,
      originalSize: true,
      thumbnailSize: true,
      previewSize: true,
      totalSize: true,
      gallery: {
        select: {
          userId: true,
        },
      },
    },
  });
  if (!photo) {
    return false;
  }

  const fallbackTotal = BigInt(photo.totalSize ?? 0);
  const computedTotal =
    BigInt(photo.originalSize ?? 0) +
    BigInt(photo.thumbnailSize ?? 0) +
    BigInt(photo.previewSize ?? 0);
  const bytesToRemove = computedTotal > 0n ? computedTotal : fallbackTotal;

  await removeStorage(userId, bytesToRemove, "delete", photo.id);

  await db.photo.delete({ where: { id: photoId } });

  void enqueuePhotoCleanup([
    photo.s3Key,
    photo.thumbnailKey ?? "",
    photo.previewKey ?? "",
  ]).catch((error) => {
    console.error(`Failed to enqueue photo cleanup for ${photoId}`, error);
  });

  return true;
};
