import { db, toDateOnly } from "./_shared";

export const getGallery = async (userId: string, galleryId: string) => {
  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    include: {
      _count: {
        select: {
          photos: { where: { status: "processed" } },
        },
      },
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
      aiContext: gallery.aiContext ?? null,
      // General settings
      categoryTags: gallery.categoryTags,
      expiresAt: gallery.expiresAt ? gallery.expiresAt.toISOString() : null,
      slideshowEnabled: gallery.slideshowEnabled,
      socialSharingEnabled: gallery.socialSharingEnabled,
      emailRegistration: gallery.emailRegistration,
      language: gallery.language,
      // Download settings
      downloadEnabled: gallery.downloadEnabled,
      downloadPin: gallery.downloadPin ?? null,
      downloadSizeOriginal: gallery.downloadSizeOriginal,
      downloadSizeHighRes: gallery.downloadSizeHighRes,
      downloadSizeWeb: gallery.downloadSizeWeb,
      downloadWebMaxPx: gallery.downloadWebMaxPx,
      downloadHighResMaxPx: gallery.downloadHighResMaxPx,
      downloadLimit: gallery.downloadLimit ?? null,
      downloadContactsOnly: gallery.downloadContactsOnly,
      // Favorites settings
      favoritesEnabled: gallery.favoritesEnabled,
      favoriteNotesEnabled: gallery.favoriteNotesEnabled,
      photoCount: gallery._count.photos,
      albums: gallery.albums.map((album: any) => ({
        id: album.id,
        galleryId: album.galleryId,
        title: album.title,
        downloadEnabled: album.downloadEnabled,
        photoIds: album.photos.map((row: any) => row.photoId),
        createdAt: album.createdAt.toISOString(),
      })),
    },
  };
};
