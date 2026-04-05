import { db } from "./_shared";
import { editGalleryComment as publicEditComment } from "../PublicGalleryServices/editGalleryComment";

export const editGalleryComment = async (
  userId: string,
  galleryId: string,
  commentId: string,
  message: string,
) => {
  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { shareToken: true },
  });

  if (!gallery) {
    return null;
  }

  return publicEditComment({
    commentId,
    shareToken: gallery.shareToken,
    viewerId: userId,
    message,
  });
};
