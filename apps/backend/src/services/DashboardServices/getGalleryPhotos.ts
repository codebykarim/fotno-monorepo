import { db } from "./_shared";
import { getPresignedDownloadUrl } from "../../utils/s3";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

export const getGalleryPhotos = async (
  userId: string,
  galleryId: string,
  limit: number = DEFAULT_LIMIT,
  offset: number = 0,
) => {
  const safeLimit = Math.min(Math.max(1, limit), MAX_LIMIT);
  const safeOffset = Math.max(0, offset);

  // Verify gallery ownership
  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { id: true, coverPhotoId: true },
  });

  if (!gallery) {
    return null;
  }

  const [photos, total] = await Promise.all([
    db.photo.findMany({
      where: { galleryId },
      orderBy: { order: "asc" },
      skip: safeOffset,
      take: safeLimit,
    }),
    db.photo.count({ where: { galleryId } }),
  ]);

  const photosWithUrls = await Promise.all(
    photos.map(async (photo: any) => {
      const thumbnailObjectKey = photo.thumbnailKey ?? photo.previewKey ?? null;
      const previewObjectKey = photo.previewKey ?? photo.thumbnailKey ?? null;
      const [thumbnailUrl, previewUrl, originalUrl] = await Promise.all([
        thumbnailObjectKey
          ? getPresignedDownloadUrl(thumbnailObjectKey, 3600)
          : Promise.resolve(null),
        previewObjectKey
          ? getPresignedDownloadUrl(previewObjectKey, 3600)
          : Promise.resolve(null),
        getPresignedDownloadUrl(photo.s3Key, 3600),
      ]);
      const resolvedPreviewUrl = previewUrl ?? originalUrl;
      const resolvedThumbnailUrl = thumbnailUrl ?? resolvedPreviewUrl;

      return {
        id: photo.id,
        galleryId: photo.galleryId,
        url: resolvedPreviewUrl,
        thumbnailUrl: resolvedThumbnailUrl,
        previewUrl: resolvedPreviewUrl,
        originalUrl,
        blurDataUrl: photo.blurDataUrl ?? null,
        order: photo.order,
        width: photo.width ?? 1200,
        height: photo.height ?? 1600,
        loved: Boolean(photo.loved),
        isCover: Boolean(gallery.coverPhotoId === photo.id),
        createdAt:
          photo.createdAt instanceof Date
            ? photo.createdAt.toISOString()
            : String(photo.createdAt),
      };
    }),
  );

  return {
    photos: photosWithUrls,
    total,
    limit: safeLimit,
    offset: safeOffset,
  };
};
