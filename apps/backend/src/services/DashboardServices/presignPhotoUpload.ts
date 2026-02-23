import { randomUUID } from "crypto";
import { getPresignedUploadUrl, s3Config } from "../../utils/s3";
import { db } from "./_shared";

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
  if (!fileName) {
    return { error: "fileName is required", status: 400 as const };
  }

  const ext = fileName.includes(".") ? fileName.split(".").pop() : "bin";
  const uploadId = randomUUID();
  const s3Key = `uploads/${galleryId}/${uploadId}.${ext}`;

  const latest = await db.photo.findFirst({
    where: { galleryId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const photo = await db.photo.create({
    data: {
      galleryId,
      s3Key,
      s3Bucket: s3Config.bucket,
      originalFilename: fileName,
      originalSize: BigInt(size > 0 ? size : 1),
      totalSize: BigInt(size > 0 ? size : 1),
      mimeType: fileType,
      aiTags: [],
      order: (latest?.order ?? -1) + 1,
      status: "pending",
      loved: false,
    },
    select: { id: true },
  });

  const uploadUrl = await getPresignedUploadUrl(s3Key, fileType, 300);
  return {
    uploadId: photo.id,
    uploadUrl,
  };
};
