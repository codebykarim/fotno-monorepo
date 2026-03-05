import { db, toDateOnly } from "./_shared";
import { getPresignedDownloadUrl } from "../../utils/s3";

export const getGallery = async (userId: string, galleryId: string) => {
  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    include: {
      photos: { orderBy: { order: "asc" } },
      albums: {
        include: { photos: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!gallery) {
    return null;
  }

  const photos = await Promise.all(
    gallery.photos.map(async (photo: any) => {
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
    gallery: {
      id: gallery.id,
      title: gallery.title,
      slug: gallery.slug,
      eventDate: toDateOnly(
        gallery.eventDate ? gallery.eventDate.toISOString() : null,
      ),
      deadline: toDateOnly(
        gallery.deadline ? gallery.deadline.toISOString() : null,
      ),
      passwordEnabled: Boolean(gallery.passwordHash),
      password: gallery.passwordHash ?? null,
      isPublished: gallery.isPublished,
      createdAt: gallery.createdAt.toISOString(),
      updatedAt: gallery.updatedAt.toISOString(),
      coverPhotoId: gallery.coverPhotoId ?? null,
      aiContext: gallery.aiContext ?? null,
      photos,
      albums: gallery.albums.map((album: any) => ({
        id: album.id,
        galleryId: album.galleryId,
        title: album.title,
        photoIds: album.photos.map((row: any) => row.photoId),
        createdAt: album.createdAt.toISOString(),
      })),
    },
  };
};
