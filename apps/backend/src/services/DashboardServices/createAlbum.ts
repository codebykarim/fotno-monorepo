import { db } from "./_shared";

export const createAlbum = async (userId: string, galleryId: string, body: any) => {
  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { id: true },
  });
  if (!gallery) {
    return { error: "Gallery not found", status: 404 as const };
  }

  const title = String(body?.title ?? "").trim();
  if (!title) {
    return { error: "title is required", status: 400 as const };
  }

  const album = await db.album.create({
    data: {
      galleryId,
      title,
    },
  });

  const photoIds = Array.isArray(body?.photoIds)
    ? body.photoIds.map((id: unknown) => String(id))
    : [];

  for (const photoId of photoIds) {
    await db.albumPhoto.upsert({
      where: { albumId_photoId: { albumId: album.id, photoId } },
      update: {},
      create: { albumId: album.id, photoId },
    });
  }

  return {
    album: {
      id: album.id,
      galleryId: album.galleryId,
      title: album.title,
      photoIds,
      createdAt: album.createdAt.toISOString(),
    },
    status: 201 as const,
  };
};
