import { publishedGalleryWhere, db } from "./_shared";

export const getPublicGallery = async (shareToken: string) => {
  const gallery = await db.gallery.findFirst({
    where: publishedGalleryWhere(shareToken),
    select: {
      id: true,
      slug: true,
      shareToken: true,
      title: true,
      passwordHash: true,
      coverPhotoId: true,
      userId: true,
      expiresAt: true,
      // Settings
      slideshowEnabled: true,
      socialSharingEnabled: true,
      emailRegistration: true,
      downloadEnabled: true,
      downloadPin: true,
      downloadSizeOriginal: true,
      downloadSizeHighRes: true,
      downloadSizeWeb: true,
      downloadWebMaxPx: true,
      downloadHighResMaxPx: true,
      downloadLimit: true,
      favoritesEnabled: true,
      favoriteNotesEnabled: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      photos: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          originalFilename: true,
          aiCaption: true,
          width: true,
          height: true,
          order: true,
        },
      },
      albums: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          title: true,
          downloadEnabled: true,
          photos: {
            select: {
              photoId: true,
            },
          },
        },
      },
    },
  });

  if (!gallery) {
    return null;
  }

  // Check auto-expiry
  if (gallery.expiresAt && new Date(gallery.expiresAt) < new Date()) {
    return { expired: true };
  }

  return {
    id: gallery.id,
    userId: gallery.userId,
    // Gallery frontend uses this value in URL segments; keep it slug-compatible.
    shareToken: gallery.slug,
    title: gallery.title,
    passwordHash: gallery.passwordHash,
    coverPhotoId: gallery.coverPhotoId,
    photographer: {
      name: gallery.user?.name ?? "FOTNO",
      logoUrl: gallery.user?.image ?? null,
    },
    settings: {
      slideshowEnabled: gallery.slideshowEnabled,
      socialSharingEnabled: gallery.socialSharingEnabled,
      emailRegistration: gallery.emailRegistration,
      downloadEnabled: gallery.downloadEnabled,
      hasDownloadPin: Boolean(gallery.downloadPin),
      downloadSizes: {
        original: gallery.downloadSizeOriginal,
        highRes: gallery.downloadSizeHighRes,
        web: gallery.downloadSizeWeb,
      },
      downloadLimit: gallery.downloadLimit,
      favoritesEnabled: gallery.favoritesEnabled,
      favoriteNotesEnabled: gallery.favoriteNotesEnabled,
    },
    photos: gallery.photos,
    albums: gallery.albums.map((album: any) => ({
      id: album.id,
      title: album.title,
      downloadEnabled: album.downloadEnabled,
      photoIds: album.photos.map((item: any) => item.photoId),
    })),
  };
};
