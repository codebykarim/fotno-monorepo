import { db } from "./_shared";

export const updateAlbum = async (
  userId: string,
  galleryId: string,
  albumId: string,
  body: any,
) => {
  const album = await db.album.findFirst({
    where: { id: albumId, galleryId, gallery: { userId } },
  });
  if (!album) {
    return null;
  }

  const title = String(body?.title ?? "").trim();
  if (title) {
    await db.album.update({
      where: { id: album.id },
      data: { title },
    });
  }

  if (Array.isArray(body?.photoIds)) {
    await db.albumPhoto.deleteMany({ where: { albumId: album.id } });
    for (const photoIdRaw of body.photoIds) {
      const photoId = String(photoIdRaw);
      await db.albumPhoto.create({
        data: { albumId: album.id, photoId },
      });
    }
  }

  const fresh = await db.album.findFirst({
    where: { id: album.id },
    include: { photos: true },
  });

  if (!fresh) {
    throw new Error("Album not found after update");
  }

  return {
    album: {
      id: fresh.id,
      galleryId: fresh.galleryId,
      title: fresh.title,
      photoIds: fresh.photos.map((row: any) => row.photoId),
      createdAt: fresh.createdAt.toISOString(),
    },
  };
};
