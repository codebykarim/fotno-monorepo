import { db, mapPhoto } from "./_shared";

export const updatePhotoLoved = async (photoId: string, loved: boolean) => {
  const updated = await db.photo.update({
    where: { id: photoId },
    data: { loved },
  });
  return { photo: mapPhoto(updated) };
};
