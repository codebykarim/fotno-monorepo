import { db } from "./_shared";
import { getPresignedDownloadUrl } from "../../utils/s3";

export const updatePhotoLoved = async (photoId: string, loved: boolean) => {
  const updated = await db.photo.update({
    where: { id: photoId },
    data: { loved },
  });

  const url = await getPresignedDownloadUrl(
    updated.previewKey ?? updated.s3Key,
    3600,
  );

  return {
    photo: {
      id: updated.id,
      galleryId: updated.galleryId,
      url,
      order: updated.order,
      width: updated.width ?? 1200,
      height: updated.height ?? 1600,
      loved: Boolean(updated.loved),
      createdAt:
        updated.createdAt instanceof Date
          ? updated.createdAt.toISOString()
          : String(updated.createdAt),
    },
  };
};
