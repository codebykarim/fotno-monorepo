import { publishedGalleryWhere, db } from "./_shared";

export const trackDownload = async (
  shareToken: string,
  body: {
    photoId?: string;
    viewerId?: string;
    viewerName?: string;
    viewerIp?: string;
    type: string;
    checkOnly?: boolean;
  },
) => {
  const gallery = await db.gallery.findFirst({
    where: publishedGalleryWhere(shareToken),
    select: { id: true, downloadLimit: true },
  });
  if (!gallery) {
    return { error: "Gallery not found", status: 404 };
  }

  // Enforce per-user per-photo download limit
  if (gallery.downloadLimit && body.photoId && body.type === "single") {
    const where: Record<string, unknown> = {
      galleryId: gallery.id,
      photoId: body.photoId,
      type: "single",
    };
    if (body.viewerId) {
      where.viewerId = body.viewerId;
    }
    const count = await db.downloadEvent.count({ where: where as any });
    if (count >= gallery.downloadLimit) {
      return {
        error: "Download limit reached for this photo",
        status: 403,
        limitReached: true,
      };
    }
  }

  // checkOnly mode: only verify limit, don't record the event yet
  if (body.checkOnly) {
    return { success: true, allowed: true };
  }

  await db.downloadEvent.create({
    data: {
      galleryId: gallery.id,
      photoId: body.photoId ?? null,
      viewerId: body.viewerId ?? null,
      viewerName: body.viewerName ?? null,
      viewerIp: body.viewerIp ?? null,
      type: body.type || "single",
    },
  });

  return { success: true };
};
