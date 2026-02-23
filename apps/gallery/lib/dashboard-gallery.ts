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
    password?: string | null;
  };
};

const getDashboardBaseUrl = (): string => {
  const dashboardUrl =
    process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:3001";
  return dashboardUrl.replace(/\/$/, "");
};

export type DashboardGalleryAccess = {
  id: string;
  slug: string;
  title: string;
  isPublished: boolean;
  passwordEnabled: boolean;
  password: string | null;
};

export const getDashboardGalleryAccessBySlug = async (
  shareToken: string,
): Promise<DashboardGalleryAccess | null> => {
  const dashboardBaseUrl = getDashboardBaseUrl();
  const listResponse = await fetch(
    `${dashboardBaseUrl}/api/galleries?q=${encodeURIComponent(shareToken)}&status=all&sort=newest`,
    { cache: "no-store" },
  );

  if (!listResponse.ok) {
    return null;
  }

  const listPayload = (await listResponse.json()) as DashboardListResponse;
  const galleryListItem = listPayload.galleries?.find(
    (gallery) => gallery.slug === shareToken,
  );

  if (!galleryListItem) {
    return null;
  }

  const detailResponse = await fetch(
    `${dashboardBaseUrl}/api/galleries/${galleryListItem.id}`,
    { cache: "no-store" },
  );

  if (!detailResponse.ok) {
    return null;
  }

  const detailPayload = (await detailResponse.json()) as DashboardGalleryResponse;
  const gallery = detailPayload.gallery;

  if (!gallery) {
    return null;
  }

  return {
    id: gallery.id,
    slug: gallery.slug,
    title: gallery.title,
    isPublished: Boolean(gallery.isPublished),
    passwordEnabled: Boolean(gallery.passwordEnabled),
    password: gallery.password ?? null,
  };
};
