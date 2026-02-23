import { getPresignedDownloadUrl } from "../../utils/s3";
import { db } from "./_shared";

export const getPublicPhotoUrl = async (
  photoId: string,
  shareToken: string,
  variant: string,
) => {
  const photo = await db.photo.findFirst({
    where: {
      id: photoId,
      gallery: {
        OR: [{ shareToken }, { slug: shareToken }],
        isPublished: true,
      },
    },
    select: {
      s3Key: true,
      thumbnailKey: true,
      previewKey: true,
    },
  });

  if (!photo) {
    return { error: "Photo not found", status: 404 as const };
  }

  const objectKey =
    variant === "thumbnail"
      ? photo.thumbnailKey ?? photo.previewKey ?? photo.s3Key
      : variant === "preview"
        ? photo.previewKey ?? photo.thumbnailKey ?? photo.s3Key
        : photo.s3Key;

  const url = await getPresignedDownloadUrl(objectKey, 300);

  return { url, status: 200 as const };
};
