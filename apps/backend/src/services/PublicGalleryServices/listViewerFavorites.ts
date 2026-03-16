import { publishedGalleryWhere, db } from "./_shared";

export const listViewerFavorites = async (
  shareToken: string,
  viewerId: string,
) => {
  const gallery = await db.gallery.findFirst({
    where: publishedGalleryWhere(shareToken),
    select: { id: true },
  });
  if (!gallery) {
    return { error: "Gallery not found", status: 404 };
  }

  const favorites = await db.galleryFavorite.findMany({
    where: { galleryId: gallery.id, viewerId },
    orderBy: { createdAt: "desc" },
  });

  // If no favorites in this gallery, check if this viewer exists in any gallery
  let viewerName: string | null = favorites[0]?.viewerName ?? null;
  if (!viewerName) {
    const anyFavorite = await db.galleryFavorite.findFirst({
      where: { viewerId },
      select: { viewerName: true },
      orderBy: { createdAt: "desc" },
    });
    viewerName = anyFavorite?.viewerName ?? null;
  }

  return {
    viewerName,
    favorites: favorites.map((f: any) => ({
      id: f.id,
      photoId: f.photoId,
      note: f.note ?? null,
      createdAt: f.createdAt.toISOString(),
    })),
  };
};
