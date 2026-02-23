import { db } from "./_shared";
import { enqueueProcessPhoto } from "../../queues/photoQueue";
import { addStorage } from "../StorageServices";
import { getPresignedDownloadUrl } from "../../utils/s3";

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
    select: {
      id: true,
      order: true,
      originalSize: true,
      s3Key: true,
      thumbnailKey: true,
      previewKey: true,
    },
  });
  if (!photo) {
    return { error: "Upload not found", status: 404 as const };
  }

  await db.photo.update({
    where: { id: photo.id },
    data: { status: "uploaded" },
  });

  await addStorage(
    userId,
    BigInt(photo.originalSize ?? 0),
    "upload",
    photo.id,
  );

  void enqueueProcessPhoto(photo.id).catch((error) => {
    console.error("Failed to enqueue process-photo job", error);
  });

  const thumbnailObjectKey = photo.thumbnailKey ?? photo.previewKey ?? null;
  const previewObjectKey = photo.previewKey ?? photo.thumbnailKey ?? null;
  const [thumbnailUrl, previewUrl, originalUrl] = await Promise.all([
    thumbnailObjectKey
      ? getPresignedDownloadUrl(thumbnailObjectKey, 3600)
      : Promise.resolve(null),
    previewObjectKey
      ? getPresignedDownloadUrl(previewObjectKey, 3600)
      : Promise.resolve(null),
    getPresignedDownloadUrl(photo.s3Key, 3600),
  ]);
  const resolvedPreviewUrl = previewUrl ?? originalUrl;
  const resolvedThumbnailUrl = thumbnailUrl ?? resolvedPreviewUrl;

  return {
    photo: {
      id: photo.id,
      galleryId,
      url: resolvedPreviewUrl,
      thumbnailUrl: resolvedThumbnailUrl,
      previewUrl: resolvedPreviewUrl,
      originalUrl,
      order: photo.order,
      width: 1200,
      height: 1600,
      loved: false,
      createdAt: new Date().toISOString(),
    },
    status: 201 as const,
  };
};
