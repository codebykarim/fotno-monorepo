import { publishedGalleryWhere, db } from "./_shared";

export const createFavoriteShare = async (
  shareToken: string,
  body: { viewerId: string; viewerName: string },
) => {
  const gallery = await db.gallery.findFirst({
    where: {
      ...publishedGalleryWhere(shareToken),
      favoritesEnabled: true,
    },
    select: { id: true },
  });
  if (!gallery) {
    return { error: "Gallery not found or favorites disabled", status: 404 };
  }

  // Verify the viewer has at least one favorite
  const favCount = await db.galleryFavorite.count({
    where: { galleryId: gallery.id, viewerId: body.viewerId },
  });
  if (favCount === 0) {
    return { error: "No favorites to share", status: 400 };
  }

  // Upsert: reuse existing share link for same viewer+gallery
  const share = await db.favoriteShare.upsert({
    where: {
      galleryId_viewerId: {
        galleryId: gallery.id,
        viewerId: body.viewerId,
      },
    },
    create: {
      galleryId: gallery.id,
      viewerId: body.viewerId,
      viewerName: body.viewerName,
    },
    update: {
      viewerName: body.viewerName,
    },
  });

  return { favoriteShareToken: share.shareToken };
};
