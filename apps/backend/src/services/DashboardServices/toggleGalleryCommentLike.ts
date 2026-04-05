import { db } from "./_shared";
import { listGalleryComments } from "./listGalleryComments";

export const toggleGalleryCommentLike = async (
  userId: string,
  galleryId: string,
  commentId: string,
) => {
  const gallery = await db.gallery.findUnique({
    where: { id: galleryId, userId },
    select: { id: true },
  });
  if (!gallery) return null;

  const comment = await db.galleryComment.findUnique({
    where: { id: commentId },
    select: { id: true, likes: true, galleryId: true },
  });
  if (!comment) return { error: "Comment not found", status: 404 as const };
  if (comment.galleryId !== galleryId) return { error: "Comment not found", status: 404 as const };

  const alreadyLiked = (comment.likes as string[]).includes(userId);

  // Use raw SQL for atomic array manipulation to avoid race conditions
  if (alreadyLiked) {
    await db.$executeRaw`
      UPDATE "gallery_comment"
      SET "likes" = array_remove("likes", ${userId})
      WHERE "id" = ${commentId}
    `;
  } else {
    await db.$executeRaw`
      UPDATE "gallery_comment"
      SET "likes" = array_append("likes", ${userId})
      WHERE "id" = ${commentId}
      AND NOT (${userId} = ANY("likes"))
    `;
  }

  return listGalleryComments(userId, galleryId);
};
