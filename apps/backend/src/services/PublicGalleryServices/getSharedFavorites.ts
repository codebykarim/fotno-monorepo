import { db } from "./_shared";

export const getSharedFavorites = async (favoriteShareToken: string) => {
  const share = await db.favoriteShare.findUnique({
    where: { shareToken: favoriteShareToken },
    include: {
      gallery: {
        select: {
          id: true,
          shareToken: true,
          title: true,
          isPublished: true,
          expiresAt: true,
          userId: true,
          user: { select: { name: true, image: true } },
          slideshowEnabled: true,
          downloadEnabled: true,
          downloadPin: true,
          downloadSizeOriginal: true,
          downloadSizeHighRes: true,
          downloadSizeWeb: true,
          downloadLimit: true,
        },
      },
    },
  });

  if (!share || !share.gallery) {
    return { error: "Shared favorites not found", status: 404 };
  }

  const gallery = share.gallery;

  if (!gallery.isPublished) {
    return { error: "Gallery not found", status: 404 };
  }

  if (gallery.expiresAt && new Date(gallery.expiresAt) < new Date()) {
    return { error: "Gallery has expired", status: 410 };
  }

  // Get favorited photos
  const favorites = await db.galleryFavorite.findMany({
    where: { galleryId: gallery.id, viewerId: share.viewerId },
    include: {
      photo: {
        select: {
          id: true,
          originalFilename: true,
          aiCaption: true,
          width: true,
          height: true,
          order: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const photos = favorites
    .filter((f: any) => f.photo)
    .map((f: any) => ({
      id: f.photo.id,
      originalFilename: f.photo.originalFilename,
      aiCaption: f.photo.aiCaption,
      width: f.photo.width,
      height: f.photo.height,
      order: f.photo.order ?? 0,
      note: f.note ?? null,
    }));

  return {
    viewerName: share.viewerName,
    gallery: {
      id: gallery.id,
      shareToken: gallery.shareToken,
      title: gallery.title,
      userId: gallery.userId,
      photographer: {
        name: gallery.user?.name ?? "FOTNO",
        logoUrl: gallery.user?.image ?? null,
      },
      settings: {
        slideshowEnabled: gallery.slideshowEnabled,
        downloadEnabled: gallery.downloadEnabled,
        hasDownloadPin: Boolean(gallery.downloadPin),
        downloadSizes: {
          original: gallery.downloadSizeOriginal,
          highRes: gallery.downloadSizeHighRes,
          web: gallery.downloadSizeWeb,
        },
        downloadLimit: gallery.downloadLimit,
      },
    },
    photos,
  };
};
