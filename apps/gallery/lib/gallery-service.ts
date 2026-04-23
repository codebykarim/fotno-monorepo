import { backendFetch } from "@/lib/backend";
import type {
  GalleryApiResponse,
  PhotoVariant,
  PublicGallery,
  PublicPhoto,
  SharedFavoritesData,
  SharedFavoritesPhoto,
} from "@/lib/gallery-types";

const TRANSPARENT_BLUR =
  "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";

type BackendPhoto = {
  id: string;
  originalFilename: string;
  width?: number | null;
  height?: number | null;
  order?: number | null;
  blurDataUrl?: string | null;
  thumbnailUrl?: string | null;
  previewUrl?: string | null;
};

type BackendGallery = {
  id: string;
  userId?: string;
  shareToken: string;
  title: string;
  passwordProtected?: boolean;
  passwordHash?: string | null;
  coverPhotoId?: string | null;
  photographer?: {
    name?: string | null;
    logoUrl?: string | null;
  } | null;
  user?: {
    name?: string | null;
    image?: string | null;
  } | null;
  settings?: {
    slideshowEnabled?: boolean;
    socialSharingEnabled?: boolean;
    emailRegistration?: boolean;
    downloadEnabled?: boolean;
    hasDownloadPin?: boolean;
    downloadSizes?: {
      original?: boolean;
      highRes?: boolean;
      web?: boolean;
    };
    downloadLimit?: number | null;
    favoritesEnabled?: boolean;
    favoriteNotesEnabled?: boolean;
    commentsEnabled?: boolean;
    smartAlbumsEnabled?: boolean;
  };
  photos?: BackendPhoto[];
  albums?: Array<{
    id: string;
    title: string;
    downloadEnabled?: boolean;
    photoIds: string[];
  }>;
};

type DashboardListResponse = {
  galleries?: Array<{
    id: string;
    slug: string;
  }>;
};

type DashboardGalleryResponse = {
  gallery?: {
    id: string;
    slug: string;
    title: string;
    isPublished?: boolean;
    passwordEnabled?: boolean;
    coverPhotoId?: string | null;
    photos?: Array<{
      id: string;
      url: string;
      thumbnailUrl?: string | null;
      previewUrl?: string | null;
      originalUrl?: string | null;
      order?: number;
      width?: number;
      height?: number;
    }>;
    albums?: Array<{
      id: string;
      title: string;
      photoIds: string[];
    }>;
  };
};

const normalizePhoto = (
  photo: BackendPhoto,
  shareToken: string,
): PublicPhoto => {
  // Use direct signed CloudFront/S3 URLs when the backend provides them.
  // Falls back to the proxy route for older backend responses.
  const proxyThumb = `/api/photos/${photo.id}/proxy?variant=thumbnail&shareToken=${encodeURIComponent(shareToken)}`;
  const proxyPreview = `/api/photos/${photo.id}/proxy?variant=preview&shareToken=${encodeURIComponent(shareToken)}`;

  return {
    id: photo.id,
    originalFilename: photo.originalFilename || `${photo.id}.jpg`,
    width: photo.width ?? null,
    height: photo.height ?? null,
    order: photo.order ?? 0,
    blurDataUrl: photo.blurDataUrl ?? TRANSPARENT_BLUR,
    thumbnailSrc: photo.thumbnailUrl ?? proxyThumb,
    previewSrc: photo.previewUrl ?? proxyPreview,
    originalSrc: null,
  };
};

const normalizeGallery = (input: BackendGallery): PublicGallery => {
  const photographerName =
    input.photographer?.name ?? input.user?.name ?? "FOTNO";
  const photographerLogo =
    input.photographer?.logoUrl ?? input.user?.image ?? null;
  const photos = (input.photos ?? [])
    .map((photo) => normalizePhoto(photo, input.shareToken))
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

  return {
    id: input.id,
    userId: input.userId ?? null,
    shareToken: input.shareToken,
    title: input.title,
    hasPassword: input.passwordProtected ?? Boolean(input.passwordHash),
    photographer: {
      name: photographerName,
      logoUrl: photographerLogo,
    },
    coverPhotoId: input.coverPhotoId ?? null,
    settings: input.settings
      ? {
          slideshowEnabled: input.settings.slideshowEnabled ?? true,
          socialSharingEnabled: input.settings.socialSharingEnabled ?? true,
          emailRegistration: input.settings.emailRegistration ?? false,
          downloadEnabled: input.settings.downloadEnabled ?? true,
          hasDownloadPin: input.settings.hasDownloadPin ?? false,
          downloadSizes: {
            original: input.settings.downloadSizes?.original ?? true,
            highRes: input.settings.downloadSizes?.highRes ?? false,
            web: input.settings.downloadSizes?.web ?? true,
          },
          downloadLimit: input.settings.downloadLimit ?? null,
          favoritesEnabled: input.settings.favoritesEnabled ?? true,
          favoriteNotesEnabled: input.settings.favoriteNotesEnabled ?? true,
          commentsEnabled: input.settings.commentsEnabled,
          smartAlbumsEnabled: input.settings.smartAlbumsEnabled,
        }
      : undefined,
    photos,
    albums: (input.albums ?? []).map((a) => ({
      id: a.id,
      title: a.title,
      downloadEnabled: a.downloadEnabled ?? true,
      photoIds: a.photoIds,
    })),
  };
};

const getDashboardBaseUrl = (): string => {
  const dashboardUrl =
    process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:3001";
  return dashboardUrl.replace(/\/$/, "");
};

const loadGalleryFromDashboardMock = async (
  shareToken: string,
): Promise<GalleryApiResponse | null> => {
  const dashboardBaseUrl = getDashboardBaseUrl();
  const listResponse = await fetch(
    `${dashboardBaseUrl}/api/galleries?q=${encodeURIComponent(shareToken)}&status=all&sort=newest`,
    { cache: "no-store" },
  );

  if (!listResponse.ok) {
    return null;
  }

  const listPayload = (await listResponse.json()) as DashboardListResponse;
  const listItem = listPayload.galleries?.find(
    (gallery) => gallery.slug === shareToken,
  );
  if (!listItem) {
    return null;
  }

  const detailResponse = await fetch(
    `${dashboardBaseUrl}/api/galleries/${listItem.id}`,
    { cache: "no-store" },
  );
  if (!detailResponse.ok) {
    return null;
  }

  const detailPayload =
    (await detailResponse.json()) as DashboardGalleryResponse;
  const gallery = detailPayload.gallery;
  if (!gallery) {
    return null;
  }

  if (!gallery.isPublished) {
    return null;
  }

  const photos = (gallery.photos ?? [])
    .map((photo) => ({
      id: photo.id,
      originalFilename: `${photo.id}.jpg`,
      width: photo.width ?? null,
      height: photo.height ?? null,
      order: photo.order ?? 0,
      blurDataUrl: TRANSPARENT_BLUR,
      thumbnailSrc: photo.thumbnailUrl ?? photo.previewUrl ?? photo.url,
      previewSrc: photo.previewUrl ?? photo.thumbnailUrl ?? photo.url,
      originalSrc: photo.originalUrl ?? null,
    }))
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

  return {
    gallery: {
      id: gallery.id,
      userId: null,
      shareToken: gallery.slug,
      title: gallery.title,
      hasPassword: Boolean(gallery.passwordEnabled),
      photographer: {
        name: "FOTNO Photographer",
        logoUrl: null,
      },
      coverPhotoId: gallery.coverPhotoId ?? null,
      photos,
      albums: (gallery.albums ?? []).map((a) => ({
        id: a.id,
        title: a.title,
        downloadEnabled: true,
        photoIds: a.photoIds,
      })),
    },
  };
};

export const getGalleryByShareToken = async (
  shareToken: string,
  opts?: {
    galleryJwt?: string;
    cache?: RequestCache;
    revalidate?: number;
  },
): Promise<GalleryApiResponse> => {
  const headers = new Headers();

  if (opts?.galleryJwt) {
    headers.set("Authorization", `Bearer ${opts.galleryJwt}`);
  }

  try {
    const response = await backendFetch(`/api/public/gallery/${shareToken}`, {
      headers,
      cache: opts?.cache,
      next:
        typeof opts?.revalidate === "number"
          ? { revalidate: process.env.NODE_ENV === "development" ? 0 : opts.revalidate }
          : undefined,
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(body || "Failed to fetch gallery");
    }

    const payload = (await response.json()) as
      | BackendGallery
      | {
          gallery: BackendGallery;
        };

    const gallery = "gallery" in payload ? payload.gallery : payload;

    return {
      gallery: normalizeGallery(gallery),
    };
  } catch (error) {
    const fallback = await loadGalleryFromDashboardMock(shareToken);
    if (fallback) {
      return fallback;
    }

    throw error;
  }
};

export const getPhotoPresignedUrl = async (
  photoId: string,
  shareToken: string,
  variant: PhotoVariant,
  galleryJwt?: string,
): Promise<string> => {
  const headers = new Headers();

  if (galleryJwt) {
    headers.set("Authorization", `Bearer ${galleryJwt}`);
  }

  try {
    const response = await backendFetch(
      `/api/public/photos/${photoId}/url?shareToken=${encodeURIComponent(shareToken)}&variant=${variant}`,
      {
        headers,
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(body || "Failed to fetch photo URL");
    }

    const payload = (await response.json()) as { url: string };

    if (!payload.url) {
      throw new Error("Backend did not return a presigned URL");
    }

    return payload.url;
  } catch (error) {
    const fallbackGallery = await loadGalleryFromDashboardMock(shareToken);
    const fallbackPhoto = fallbackGallery?.gallery.photos.find(
      (photo) => photo.id === photoId,
    );

    if (fallbackPhoto) {
      if (variant === "thumbnail") {
        return fallbackPhoto.thumbnailSrc;
      }
      if (variant === "preview") {
        return fallbackPhoto.previewSrc;
      }
      if (fallbackPhoto.originalSrc) {
        return fallbackPhoto.originalSrc;
      }
      throw new Error("Original image URL unavailable in fallback response");
    }

    throw error;
  }
};

export const getSharedFavorites = async (
  favoriteShareToken: string,
): Promise<SharedFavoritesData> => {
  const response = await backendFetch(
    `/api/public/shared-favorites/${encodeURIComponent(favoriteShareToken)}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Failed to fetch shared favorites");
  }

  const payload = await response.json();
  const galleryShareToken = payload.gallery?.shareToken ?? "";

  const photos: SharedFavoritesPhoto[] = (payload.photos ?? []).map(
    (p: any) => ({
      id: p.id,
      originalFilename: p.originalFilename || `${p.id}.jpg`,
      width: p.width ?? null,
      height: p.height ?? null,
      order: p.order ?? 0,
      blurDataUrl: TRANSPARENT_BLUR,
      thumbnailSrc: `/api/photos/${p.id}/proxy?variant=thumbnail&shareToken=${encodeURIComponent(galleryShareToken)}`,
      previewSrc: `/api/photos/${p.id}/proxy?variant=preview&shareToken=${encodeURIComponent(galleryShareToken)}`,
      originalSrc: null,
      note: p.note ?? null,
    }),
  );

  return {
    viewerName: payload.viewerName ?? "",
    gallery: {
      id: payload.gallery.id,
      shareToken: galleryShareToken,
      title: payload.gallery.title,
      userId: payload.gallery.userId ?? null,
      photographer: {
        name: payload.gallery.photographer?.name ?? "FOTNO",
        logoUrl: payload.gallery.photographer?.logoUrl ?? null,
      },
      settings: payload.gallery.settings
        ? {
            slideshowEnabled: payload.gallery.settings.slideshowEnabled ?? true,
            downloadEnabled: payload.gallery.settings.downloadEnabled ?? true,
            hasDownloadPin: payload.gallery.settings.hasDownloadPin ?? false,
            downloadSizes: {
              original:
                payload.gallery.settings.downloadSizes?.original ?? true,
              highRes:
                payload.gallery.settings.downloadSizes?.highRes ?? false,
              web: payload.gallery.settings.downloadSizes?.web ?? true,
            },
            downloadLimit: payload.gallery.settings.downloadLimit ?? null,
          }
        : undefined,
    },
    photos,
  };
};
