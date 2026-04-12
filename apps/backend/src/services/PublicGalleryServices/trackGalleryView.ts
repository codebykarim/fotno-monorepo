import { publishedGalleryWhere, db } from "./_shared";

export const trackGalleryView = async (
  shareToken: string,
  body: {
    viewerIp?: string;
    userAgent?: string;
  },
) => {
  const gallery = await db.gallery.findFirst({
    where: publishedGalleryWhere(shareToken),
    select: { id: true },
  });
  if (!gallery) {
    return { error: "Gallery not found", status: 404 };
  }

  await db.galleryView.create({
    data: {
      galleryId: gallery.id,
      viewerIp: body.viewerIp ?? null,
      userAgent: body.userAgent ?? null,
    },
  });

  return { success: true };
};
