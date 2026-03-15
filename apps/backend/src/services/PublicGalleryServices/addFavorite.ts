import { publishedGalleryWhere, db } from "./_shared";

export const addFavorite = async (
  shareToken: string,
  body: { photoId: string; viewerId: string; viewerName: string; note?: string },
) => {
  const gallery = await db.gallery.findFirst({
    where: {
      ...publishedGalleryWhere(shareToken),
      favoritesEnabled: true,
    },
    select: { id: true, favoriteNotesEnabled: true },
  });
  if (!gallery) {
    return { error: "Gallery not found or favorites disabled", status: 404 };
  }

  const favorite = await db.galleryFavorite.upsert({
    where: {
      galleryId_photoId_viewerId: {
        galleryId: gallery.id,
        photoId: body.photoId,
        viewerId: body.viewerId,
      },
    },
    create: {
      galleryId: gallery.id,
      photoId: body.photoId,
      viewerId: body.viewerId,
      viewerName: body.viewerName,
      note: gallery.favoriteNotesEnabled ? body.note ?? null : null,
    },
    update: {
      viewerName: body.viewerName,
      note: gallery.favoriteNotesEnabled ? body.note ?? null : null,
    },
  });

  return {
    favorite: {
      id: favorite.id,
      photoId: favorite.photoId,
      note: favorite.note ?? null,
      createdAt: favorite.createdAt.toISOString(),
    },
  };
};
