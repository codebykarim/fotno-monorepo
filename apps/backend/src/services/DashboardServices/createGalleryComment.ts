import { db } from "./_shared";
import { createGalleryComment as publicCreateComment } from "../PublicGalleryServices/createGalleryComment";

export const createGalleryComment = async (
  userId: string,
  galleryId: string,
  message: string,
  photoId?: string | null,
  parentId?: string | null,
) => {
  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { shareToken: true, user: { select: { name: true } } },
  });

  if (!gallery) {
    return null;
  }

  return publicCreateComment({
    shareToken: gallery.shareToken,
    authorName: gallery.user?.name ?? "Photographer",
    authorRole: "photographer",
    message,
    photoId: photoId ?? null,
    parentId: parentId ?? null,
    viewerId: userId,
  });
};
