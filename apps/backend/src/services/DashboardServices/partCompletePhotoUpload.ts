import { db } from "./_shared";
import { uploadServiceRequest } from "./uploadServiceClient";

type PartCompleteResponse = {
  completedCount: number;
  totalParts: number;
  isComplete: boolean;
};

/**
 * Records that a multipart chunk has been uploaded. Called by the client after each PUT to S3.
 * The upload-service updates the session's completed parts. Returns completedCount, totalParts, and isComplete.
 */
export const partCompletePhotoUpload = async (
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

  const photoId = String(body?.photoId ?? body?.uploadId ?? "").trim();
  const partNumber = Number(body?.partNumber ?? 0);
  const etag = String(body?.etag ?? "").trim();

  if (!photoId) {
    return { error: "photoId is required", status: 400 as const };
  }

  if (!Number.isInteger(partNumber) || partNumber <= 0) {
    return { error: "partNumber must be a positive integer", status: 400 as const };
  }

  if (!etag) {
    return { error: "etag is required", status: 400 as const };
  }

  const response = await uploadServiceRequest<PartCompleteResponse>(
    userId,
    "/api/upload/part-complete",
    {
      method: "PATCH",
      body: JSON.stringify({
        photoId,
        partNumber,
        etag,
      }),
    },
  );

  if (!response.ok) {
    return { error: response.error, status: response.status };
  }

  return {
    ...response.data,
    status: 200 as const,
  };
};
