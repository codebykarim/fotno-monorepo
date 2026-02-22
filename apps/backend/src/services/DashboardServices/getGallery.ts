import { db, mapPhoto, toDateOnly } from "./_shared";

export const getGallery = async (userId: string, galleryId: string) => {
  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    include: {
      photos: { orderBy: { order: "asc" } },
      albums: {
        include: { photos: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!gallery) {
    return null;
  }

  return {
    gallery: {
      id: gallery.id,
      title: gallery.title,
      slug: gallery.slug,
      eventDate: toDateOnly(
        gallery.eventDate ? gallery.eventDate.toISOString() : null,
      ),
      deadline: toDateOnly(
        gallery.deadline ? gallery.deadline.toISOString() : null,
      ),
      passwordEnabled: Boolean(gallery.passwordHash),
      password: gallery.passwordHash ?? null,
      isPublished: gallery.isPublished,
      createdAt: gallery.createdAt.toISOString(),
      updatedAt: gallery.updatedAt.toISOString(),
      coverPhotoId: gallery.coverPhotoId ?? null,
      photos: gallery.photos.map(mapPhoto),
      albums: gallery.albums.map((album: any) => ({
        id: album.id,
        galleryId: album.galleryId,
        title: album.title,
        photoIds: album.photos.map((row: any) => row.photoId),
        createdAt: album.createdAt.toISOString(),
      })),
    },
  };
};
