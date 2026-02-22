import { db } from "./_shared";

export const deletePhoto = async (photoId: string) => {
  const photo = await db.photo.findUnique({
    where: { id: photoId },
    select: { id: true },
  });
  if (!photo) {
    return false;
  }

  await db.photo.delete({ where: { id: photoId } });
  return true;
};
