import { db, toDateOnly, toIsoOrNull } from "./_shared";

export const updateGallery = async (userId: string, galleryId: string, body: any) => {
  const current = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { id: true },
  });
  if (!current) {
    return null;
  }

  const data: Record<string, unknown> = {};
  if (typeof body?.title === "string") {
    data.title = body.title.trim();
  }
  if (typeof body?.slug === "string") {
    data.slug = body.slug.trim();
  }
  if (typeof body?.coverPhotoId === "string" || body?.coverPhotoId === null) {
    data.coverPhotoId = body.coverPhotoId;
  }
  if (typeof body?.isPublished === "boolean") {
    data.isPublished = body.isPublished;
  }
  if (typeof body?.passwordEnabled === "boolean") {
    data.passwordHash = body.passwordEnabled ? String(body?.password ?? "") : null;
  }
  if (typeof body?.eventDate === "string" || body?.eventDate === null) {
    data.eventDate = body?.eventDate ? toIsoOrNull(body.eventDate) : null;
  }
  if (typeof body?.deadline === "string" || body?.deadline === null) {
    data.deadline = body?.deadline ? toIsoOrNull(body.deadline) : null;
  }
  // General settings
  if (Array.isArray(body?.categoryTags)) {
    data.categoryTags = body.categoryTags.filter((t: unknown) => typeof t === "string");
  }
  if (typeof body?.expiresAt === "string" || body?.expiresAt === null) {
    data.expiresAt = body.expiresAt ? toIsoOrNull(body.expiresAt) : null;
  }
  if (typeof body?.slideshowEnabled === "boolean") {
    data.slideshowEnabled = body.slideshowEnabled;
  }
  if (typeof body?.socialSharingEnabled === "boolean") {
    data.socialSharingEnabled = body.socialSharingEnabled;
  }
  if (typeof body?.emailRegistration === "boolean") {
    data.emailRegistration = body.emailRegistration;
  }
  if (typeof body?.language === "string") {
    data.language = body.language;
  }

  // Download settings
  if (typeof body?.downloadEnabled === "boolean") {
    data.downloadEnabled = body.downloadEnabled;
  }
  if (typeof body?.downloadPin === "string" || body?.downloadPin === null) {
    data.downloadPin = body.downloadPin;
  }
  if (typeof body?.downloadSizeOriginal === "boolean") {
    data.downloadSizeOriginal = body.downloadSizeOriginal;
  }
  if (typeof body?.downloadSizeHighRes === "boolean") {
    data.downloadSizeHighRes = body.downloadSizeHighRes;
  }
  if (typeof body?.downloadSizeWeb === "boolean") {
    data.downloadSizeWeb = body.downloadSizeWeb;
  }
  if (typeof body?.downloadWebMaxPx === "number") {
    data.downloadWebMaxPx = body.downloadWebMaxPx;
  }
  if (typeof body?.downloadHighResMaxPx === "number") {
    data.downloadHighResMaxPx = body.downloadHighResMaxPx;
  }
  if (typeof body?.downloadLimit === "number" || body?.downloadLimit === null) {
    data.downloadLimit = body.downloadLimit;
  }
  // Favorites settings
  if (typeof body?.favoritesEnabled === "boolean") {
    data.favoritesEnabled = body.favoritesEnabled;
  }
  if (typeof body?.favoriteNotesEnabled === "boolean") {
    data.favoriteNotesEnabled = body.favoriteNotesEnabled;
  }

  const updated = await db.gallery.update({
    where: { id: galleryId },
    data,
  });

  return {
    gallery: {
      id: updated.id,
      title: updated.title,
      slug: updated.slug,
      eventDate: toDateOnly(
        updated.eventDate ? updated.eventDate.toISOString() : null,
      ),
      deadline: toDateOnly(
        updated.deadline ? updated.deadline.toISOString() : null,
      ),
      passwordEnabled: Boolean(updated.passwordHash),
      password: updated.passwordHash ?? null,
      isPublished: updated.isPublished,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      coverPhotoId: updated.coverPhotoId ?? null,
      // General settings
      categoryTags: updated.categoryTags,
      expiresAt: updated.expiresAt ? updated.expiresAt.toISOString() : null,
      slideshowEnabled: updated.slideshowEnabled,
      socialSharingEnabled: updated.socialSharingEnabled,
      emailRegistration: updated.emailRegistration,
      language: updated.language,
      // Download settings
      downloadEnabled: updated.downloadEnabled,
      downloadPin: updated.downloadPin ?? null,
      downloadSizeOriginal: updated.downloadSizeOriginal,
      downloadSizeHighRes: updated.downloadSizeHighRes,
      downloadSizeWeb: updated.downloadSizeWeb,
      downloadWebMaxPx: updated.downloadWebMaxPx,
      downloadHighResMaxPx: updated.downloadHighResMaxPx,
      downloadLimit: updated.downloadLimit ?? null,
      // Favorites settings
      favoritesEnabled: updated.favoritesEnabled,
      favoriteNotesEnabled: updated.favoriteNotesEnabled,
    },
  };
};
