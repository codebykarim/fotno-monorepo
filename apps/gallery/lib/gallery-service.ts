import { backendFetch } from "@/lib/backend";
import type {
  GalleryApiResponse,
  PhotoVariant,
  PublicGallery,
  PublicPhoto,
} from "@/lib/gallery-types";

const TRANSPARENT_BLUR =
  "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";

type BackendPhoto = {
  id: string;
  originalFilename: string;
  aiCaption?: string | null;
  width?: number | null;
  height?: number | null;
  order?: number | null;
};

type BackendGallery = {
  id: string;
  shareToken: string;
  title: string;
  passwordHash: string | null;
  coverPhotoId?: string | null;
  photographer?: {
    name?: string | null;
    logoUrl?: string | null;
  } | null;
  user?: {
    name?: string | null;
    image?: string | null;
  } | null;
  photos?: BackendPhoto[];
  albums?: Array<{
    id: string;
    title: string;
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
): PublicPhoto => ({
  id: photo.id,
  originalFilename: photo.originalFilename || `${photo.id}.jpg`,
  aiCaption: photo.aiCaption ?? null,
  width: photo.width ?? null,
  height: photo.height ?? null,
  order: photo.order ?? 0,
  blurDataUrl: TRANSPARENT_BLUR,
  thumbnailSrc: `/api/photos/${photo.id}/proxy?variant=thumbnail&shareToken=${encodeURIComponent(shareToken)}`,
  previewSrc: `/api/photos/${photo.id}/proxy?variant=preview&shareToken=${encodeURIComponent(shareToken)}`,
});

const normalizeGallery = (input: BackendGallery): PublicGallery => {
  const photographerName =
    input.photographer?.name ?? input.user?.name ?? "FOTNO";
  const photographerLogo =
    input.photographer?.logoUrl ?? input.user?.image ?? null;
  const photos = (input.photos ?? [])
    .map((photo) => normalizePhoto(photo, input.shareToken))
    .sort((a, b) => a.order - b.order);

  return {
    id: input.id,
    shareToken: input.shareToken,
    title: input.title,
    hasPassword: Boolean(input.passwordHash),
    photographer: {
      name: photographerName,
      logoUrl: photographerLogo,
    },
    coverPhotoId: input.coverPhotoId ?? null,
    photos,
    albums: input.albums ?? [],
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
      aiCaption: null,
      width: photo.width ?? null,
      height: photo.height ?? null,
      order: photo.order ?? 0,
      blurDataUrl: TRANSPARENT_BLUR,
      thumbnailSrc: photo.url,
      previewSrc: photo.url,
    }))
    .sort((a, b) => a.order - b.order);

  return {
    gallery: {
      id: gallery.id,
      shareToken: gallery.slug,
      title: gallery.title,
      hasPassword: Boolean(gallery.passwordEnabled),
      photographer: {
        name: "FOTNO Photographer",
        logoUrl: null,
      },
      coverPhotoId: gallery.coverPhotoId ?? null,
      photos,
      albums: gallery.albums ?? [],
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
          ? { revalidate: opts.revalidate }
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
      return fallbackPhoto.previewSrc;
    }

    throw error;
  }
};
