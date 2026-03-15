import { publishedGalleryWhere, db } from "./_shared";

export const verifyDownloadPin = async (
  shareToken: string,
  pin: string,
) => {
  const gallery = await db.gallery.findFirst({
    where: publishedGalleryWhere(shareToken),
    select: { id: true, downloadPin: true, downloadEnabled: true },
  });
  if (!gallery) {
    return { error: "Gallery not found", status: 404 };
  }
  if (!gallery.downloadEnabled) {
    return { error: "Downloads are disabled", status: 403 };
  }
  if (!gallery.downloadPin) {
    return { valid: true };
  }

  return { valid: gallery.downloadPin === pin };
};
