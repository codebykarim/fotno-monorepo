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
  if (typeof body?.aiContext === "string" || body?.aiContext === null) {
    data.aiContext = body.aiContext;
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
      aiContext: updated.aiContext ?? null,
    },
  };
};
