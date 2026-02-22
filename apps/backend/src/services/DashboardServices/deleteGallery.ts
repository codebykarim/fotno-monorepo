import { db } from "./_shared";

export const deleteGallery = async (userId: string, galleryId: string) => {
  const existing = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { id: true },
  });
  if (!existing) {
    return false;
  }
  await db.gallery.delete({ where: { id: galleryId } });
  return true;
};
