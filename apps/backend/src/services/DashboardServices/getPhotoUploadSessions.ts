import { db } from "./_shared";
import { uploadServiceRequest } from "./uploadServiceClient";

type UploadSessionPart = {
  partNumber: number;
  etag: string;
};

type UploadSessionPresignedPart = {
  partNumber: number;
  url: string;
};

type UploadSession = {
  photoId: string;
  uploadId: string;
  s3Key: string;
  filename: string;
  mimeType: string;
  checksum?: string | null;
  totalSize?: string;
  totalParts: number;
  completedParts: UploadSessionPart[];
  missingParts: number[];
  presignedParts: UploadSessionPresignedPart[];
  expiresAt: string;
};

type UploadSessionResponse = {
  sessions: UploadSession[];
};

export const getPhotoUploadSessions = async (
  userId: string,
  galleryId: string,
) => {
  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { id: true },
  });

  if (!gallery) {
    return { error: "Gallery not found", status: 404 as const };
  }

  const response = await uploadServiceRequest<UploadSessionResponse>(
    userId,
    `/api/upload/session/${galleryId}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    return { error: response.error, status: response.status };
  }

  return {
    sessions: response.data.sessions,
    status: 200 as const,
  };
};
