import { db } from "./_shared";
import { deleteGalleryComment as publicDeleteComment } from "../PublicGalleryServices/deleteGalleryComment";

export const deleteGalleryComment = async (
  userId: string,
  galleryId: string,
  commentId: string,
) => {
  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { shareToken: true },
  });

  if (!gallery) {
    return null;
  }

  return publicDeleteComment({
    commentId,
    shareToken: gallery.shareToken,
    viewerId: userId,
    isGalleryOwner: true,
  });
};
