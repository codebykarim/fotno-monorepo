import { db } from "./_shared";
import { getPresignedDownloadUrl } from "../../utils/s3";
import { uploadServiceRequest } from "./uploadServiceClient";

type ConfirmUploadResponse = {
  success: boolean;
  photo: {
    id: string;
    status: string;
    originalSize: string;
  };
};

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

  const photoId = String(uploadIdRaw ?? "").trim();
  if (!photoId) {
    return { error: "photoId is required", status: 400 as const };
  }

  const confirmResult = await uploadServiceRequest<ConfirmUploadResponse>(
    userId,
    "/api/upload/confirm",
    {
      method: "POST",
      body: JSON.stringify({ photoId }),
    },
  );

  if (!confirmResult.ok) {
    return {
      error: confirmResult.error,
      status: confirmResult.status,
    };
  }

  const photo = await db.photo.findUnique({
    where: { id: confirmResult.data.photo.id },
    select: {
      id: true,
      galleryId: true,
      order: true,
      s3Key: true,
      thumbnailKey: true,
      previewKey: true,
      width: true,
      height: true,
      loved: true,
      createdAt: true,
    },
  });

  if (!photo || photo.galleryId !== galleryId) {
    return { error: "Upload not found", status: 404 as const };
  }

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
      width: photo.width ?? 1200,
      height: photo.height ?? 1600,
      loved: Boolean(photo.loved),
      createdAt:
        photo.createdAt instanceof Date
          ? photo.createdAt.toISOString()
          : String(photo.createdAt),
    },
    status: 200 as const,
  };
};
