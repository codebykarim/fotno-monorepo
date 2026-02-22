import { db } from "./_shared";

export const reorderGalleryPhotos = async (
  userId: string,
  galleryId: string,
  items: Array<{ photoId: string; order: number }>,
) => {
  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { id: true },
  });
  if (!gallery) {
    return false;
  }

  await Promise.all(
    items.map((item) =>
      db.photo.updateMany({
        where: { id: item.photoId, galleryId },
        data: { order: Number(item.order) || 0 },
      }),
    ),
  );

  return true;
};
