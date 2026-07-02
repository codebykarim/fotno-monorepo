import { db } from "./_shared";
import { getPresignedDownloadUrl } from "../../utils/s3";

export const listGalleryFavorites = async (
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

  const favorites = await db.galleryFavorite.findMany({
    where: { galleryId },
    include: {
      photo: {
        select: {
          id: true,
          thumbnailKey: true,
          previewKey: true,
          s3Key: true,
          originalFilename: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const photosByFavoriteId = new Map<
    string,
    {
      id: string;
      thumbnailUrl: string;
      previewUrl: string;
      originalUrl: string;
      originalFilename: string;
    }
  >();

  await Promise.all(
    favorites.map(async (favorite: any) => {
      if (!favorite.photo) {
        return;
      }

      const thumbnailKey =
        favorite.photo.thumbnailKey ??
        favorite.photo.previewKey ??
        favorite.photo.s3Key;
      const previewKey =
        favorite.photo.previewKey ??
        favorite.photo.thumbnailKey ??
        favorite.photo.s3Key;
      const [thumbnailUrl, previewUrl, originalUrl] = await Promise.all([
        getPresignedDownloadUrl(thumbnailKey, 3600),
        getPresignedDownloadUrl(previewKey, 3600),
        getPresignedDownloadUrl(favorite.photo.s3Key, 3600),
      ]);

      photosByFavoriteId.set(favorite.id, {
        id: favorite.photo.id,
        thumbnailUrl,
        previewUrl,
        originalUrl,
        originalFilename: favorite.photo.originalFilename,
      });
    }),
  );

  // Group by viewer
  const byViewer: Record<
    string,
    { viewerId: string; viewerName: string; items: typeof favorites }
  > = {};
  for (const fav of favorites) {
    if (!byViewer[fav.viewerId]) {
      byViewer[fav.viewerId] = {
        viewerId: fav.viewerId,
        viewerName: fav.viewerName,
        items: [],
      };
    }
    byViewer[fav.viewerId].items.push(fav);
  }

  return {
    total: favorites.length,
    viewers: Object.values(byViewer).map((v) => ({
      viewerId: v.viewerId,
      viewerName: v.viewerName,
      count: v.items.length,
      favorites: v.items.map((f: any) => ({
        id: f.id,
        photoId: f.photoId,
        note: f.note ?? null,
        createdAt: f.createdAt.toISOString(),
        photo: photosByFavoriteId.get(f.id) ?? null,
      })),
    })),
  };
};
