import { db } from "./_shared";
import { enqueuePhotoCleanup } from "../../queues/photoQueue";
import { removeStorage } from "../StorageServices";

export const deletePhoto = async (photoId: string) => {
  const photo = await db.photo.findUnique({
    where: { id: photoId },
    select: {
      id: true,
      s3Key: true,
      thumbnailKey: true,
      previewKey: true,
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

  await removeStorage(
    photo.gallery.userId,
    BigInt(photo.totalSize ?? 0),
    "delete",
    photo.id,
  );

  await db.photo.delete({ where: { id: photoId } });

  await enqueuePhotoCleanup([
    photo.s3Key,
    photo.thumbnailKey ?? "",
    photo.previewKey ?? "",
  ]);

  return true;
};
