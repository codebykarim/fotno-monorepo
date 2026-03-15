import { db } from "./_shared";

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
    orderBy: { createdAt: "desc" },
  });

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
      })),
    })),
  };
};
