import { db } from "./_shared";

export const retryFailedPhotos = async (
  userId: string,
  galleryId: string,
) => {
  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { id: true },
  });

  if (!gallery) {
    return null;
  }

  // Reset both failed AND stuck "processing" photos back to "uploaded"
  // so the image processor can pick them up again
  const result = await db.photo.updateMany({
    where: {
      galleryId,
      status: { in: ["failed", "processing"] },
    },
    data: { status: "uploaded" },
  });

  return { retried: result.count };
};
