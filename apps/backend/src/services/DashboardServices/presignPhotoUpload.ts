import { db } from "./_shared";
import { uploadServiceRequest } from "./uploadServiceClient";

const FALLBACK_CHECKSUM = "0".repeat(64);

type BatchInitFileResult = {
  photoId: string;
  uploadId: string;
  totalParts: number;
  presignedParts: Array<{ partNumber: number; url: string }>;
  duplicate: boolean;
  error?: string;
};

type BatchInitResponse = {
  results: BatchInitFileResult[];
  storageWarning?: "approaching_limit" | "over_limit";
};

export const presignPhotoUpload = async (
  userId: string,
  galleryId: string,
  body: any,
) => {
  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { id: true },
  });
  if (!gallery) {
    return { error: "Gallery not found", status: 404 as const };
  }

  const fileName = String(body?.fileName ?? "").trim();
  const fileType = String(body?.fileType ?? "application/octet-stream");
  const size = Number(body?.size ?? 0);
  const checksumInput = String(body?.checksum ?? "").trim().toLowerCase();
  const checksum = /^[a-f0-9]{64}$/.test(checksumInput)
    ? checksumInput
    : FALLBACK_CHECKSUM;

  if (!fileName) {
    return { error: "fileName is required", status: 400 as const };
  }
  if (!Number.isFinite(size) || size <= 0) {
    return { error: "size must be a positive number", status: 400 as const };
  }

  const response = await uploadServiceRequest<BatchInitResponse>(
    userId,
    "/api/upload/batch-init",
    {
      method: "POST",
      body: JSON.stringify({
        galleryId,
        files: [
          {
            filename: fileName,
            mimeType: fileType,
            size,
            checksum,
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    return { error: response.error, status: response.status };
  }

  const result = response.data.results[0];
  if (!result) {
    return { error: "Upload initialization failed", status: 500 as const };
  }

  if (result.error) {
    return { error: result.error, status: 400 as const };
  }

  return {
    uploadId: result.photoId,
    photoId: result.photoId,
    s3UploadId: result.uploadId,
    totalParts: result.totalParts,
    presignedParts: result.presignedParts,
    duplicate: result.duplicate,
    storageWarning: response.data.storageWarning,
    status: 200 as const,
  };
};
