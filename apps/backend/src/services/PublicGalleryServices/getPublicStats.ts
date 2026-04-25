import { db } from "./_shared";

export const getPublicStats = async () => {
  const [photoCount, galleryCount, photographerCount, favoriteCount] =
    await Promise.all([
      db.photo.count(),
      db.gallery.count(),
      db.user.count(),
      db.galleryFavorite.count(),
    ]);
  return { photoCount, galleryCount, photographerCount, favoriteCount };
};
