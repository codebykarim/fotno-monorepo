import { publishedGalleryWhere, db } from "./_shared";

export const trackDownload = async (
  shareToken: string,
  body: {
    photoId?: string;
    viewerName?: string;
    viewerIp?: string;
    type: string;
  },
) => {
  const gallery = await db.gallery.findFirst({
    where: publishedGalleryWhere(shareToken),
    select: { id: true, downloadLimit: true },
  });
  if (!gallery) {
    return { error: "Gallery not found", status: 404 };
  }

  // Enforce per-photo download limit
  if (gallery.downloadLimit && body.photoId && body.type === "single") {
    const count = await db.downloadEvent.count({
      where: {
        galleryId: gallery.id,
        photoId: body.photoId,
        type: "single",
      },
    });
    if (count >= gallery.downloadLimit) {
      return {
        error: "Download limit reached for this photo",
        status: 403,
        limitReached: true,
      };
    }
  }

  await db.downloadEvent.create({
    data: {
      galleryId: gallery.id,
      photoId: body.photoId ?? null,
      viewerName: body.viewerName ?? null,
      viewerIp: body.viewerIp ?? null,
      type: body.type || "single",
    },
  });

  return { success: true };
};
