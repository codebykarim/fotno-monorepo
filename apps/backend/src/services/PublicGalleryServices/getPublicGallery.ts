import { publishedGalleryWhere, db } from "./_shared";
import { getPresignedDownloadUrl } from "../../utils/s3";

/** Signed URL TTL for gallery view – 1 hour gives plenty of browsing time. */
const GALLERY_VIEW_URL_TTL = 3600;

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
        where: { status: "processed" },
        orderBy: { order: "asc" },
        select: {
          id: true,
          originalFilename: true,
          aiCaption: true,
          width: true,
          height: true,
          order: true,
          thumbnailKey: true,
          previewKey: true,
          blurDataUrl: true,
          s3Key: true,
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

  // Generate signed CloudFront/S3 URLs for thumbnails and previews in parallel.
  // This is fast (just crypto signing, no network calls) and eliminates the
  // need for the gallery app to proxy every single image through its own server.
  const photosWithUrls = await Promise.all(
    gallery.photos.map(async (photo: any) => {
      const thumbnailKey = photo.thumbnailKey ?? photo.previewKey ?? photo.s3Key;
      const previewKey = photo.previewKey ?? photo.thumbnailKey ?? photo.s3Key;

      const [thumbnailUrl, previewUrl] = await Promise.all([
        getPresignedDownloadUrl(thumbnailKey, GALLERY_VIEW_URL_TTL),
        getPresignedDownloadUrl(previewKey, GALLERY_VIEW_URL_TTL),
      ]);

      return {
        id: photo.id,
        originalFilename: photo.originalFilename,
        aiCaption: photo.aiCaption,
        width: photo.width,
        height: photo.height,
        order: photo.order,
        blurDataUrl: photo.blurDataUrl,
        thumbnailUrl,
        previewUrl,
      };
    }),
  );

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
    photos: photosWithUrls,
    albums: gallery.albums.map((album: any) => ({
      id: album.id,
      title: album.title,
      downloadEnabled: album.downloadEnabled,
      photoIds: album.photos.map((item: any) => item.photoId),
    })),
  };
};
