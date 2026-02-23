import { db } from "./_shared";
import { getPresignedDownloadUrl } from "../../utils/s3";

export const updatePhotoLoved = async (
  userId: string,
  photoId: string,
  loved: boolean,
) => {
  const photo = await db.photo.findFirst({
    where: {
      id: photoId,
      gallery: {
        userId,
      },
    },
    select: { id: true },
  });

  if (!photo) {
    return null;
  }

  const updated = await db.photo.update({
    where: { id: photoId },
    data: { loved },
  });

  const thumbnailObjectKey = updated.thumbnailKey ?? updated.previewKey ?? null;
  const previewObjectKey = updated.previewKey ?? updated.thumbnailKey ?? null;
  const [thumbnailUrl, previewUrl, originalUrl] = await Promise.all([
    thumbnailObjectKey
      ? getPresignedDownloadUrl(thumbnailObjectKey, 3600)
      : Promise.resolve(null),
    previewObjectKey
      ? getPresignedDownloadUrl(previewObjectKey, 3600)
      : Promise.resolve(null),
    getPresignedDownloadUrl(updated.s3Key, 3600),
  ]);
  const resolvedPreviewUrl = previewUrl ?? originalUrl;
  const resolvedThumbnailUrl = thumbnailUrl ?? resolvedPreviewUrl;

  return {
    photo: {
      id: updated.id,
      galleryId: updated.galleryId,
      url: resolvedPreviewUrl,
      thumbnailUrl: resolvedThumbnailUrl,
      previewUrl: resolvedPreviewUrl,
      originalUrl,
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
