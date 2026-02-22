import { db } from "./_shared";

export const confirmPhotoUpload = async (
  userId: string,
  galleryId: string,
  uploadIdRaw: string,
) => {
  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { id: true },
  });
  if (!gallery) {
    return { error: "Gallery not found", status: 404 as const };
  }

  const uploadId = String(uploadIdRaw ?? "").trim();
  if (!uploadId) {
    return { error: "uploadId is required", status: 400 as const };
  }

  const photo = await db.photo.findFirst({
    where: { id: uploadId, galleryId },
    select: { id: true, order: true },
  });
  if (!photo) {
    return { error: "Upload not found", status: 404 as const };
  }

  await db.photo.update({
    where: { id: photo.id },
    data: { status: "UPLOADED" },
  });

  return {
    photo: {
      id: photo.id,
      galleryId,
      url: `https://picsum.photos/seed/${photo.id}/1200/1600`,
      order: photo.order,
      width: 1200,
      height: 1600,
      loved: false,
      createdAt: new Date().toISOString(),
    },
    status: 201 as const,
  };
};
