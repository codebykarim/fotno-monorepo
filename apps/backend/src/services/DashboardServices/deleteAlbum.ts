import { db } from "./_shared";

export const deleteAlbum = async (
  userId: string,
  galleryId: string,
  albumId: string,
) => {
  const album = await db.album.findFirst({
    where: { id: albumId, galleryId, gallery: { userId } },
    select: { id: true },
  });
  if (!album) {
    return false;
  }

  await db.album.delete({ where: { id: album.id } });
  return true;
};
