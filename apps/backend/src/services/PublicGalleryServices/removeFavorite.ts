import { publishedGalleryWhere, db } from "./_shared";

export const removeFavorite = async (
  shareToken: string,
  photoId: string,
  viewerId: string,
) => {
  const gallery = await db.gallery.findFirst({
    where: publishedGalleryWhere(shareToken),
    select: { id: true },
  });
  if (!gallery) {
    return { error: "Gallery not found", status: 404 };
  }

  await db.galleryFavorite.deleteMany({
    where: {
      galleryId: gallery.id,
      photoId,
      viewerId,
    },
  });

  return { success: true };
};
