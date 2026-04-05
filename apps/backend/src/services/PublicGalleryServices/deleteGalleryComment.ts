import { db } from "./_shared";
import { listGalleryComments } from "./listGalleryComments";

type DeleteCommentInput = {
  commentId: string;
  shareToken: string;
  viewerId: string;
  isGalleryOwner?: boolean;
};

export const deleteGalleryComment = async (input: DeleteCommentInput) => {
  const gallery = await db.gallery.findFirst({
    where: { OR: [{ shareToken: input.shareToken }, { slug: input.shareToken }] },
    select: { id: true, userId: true },
  });

  if (!gallery) {
    return { error: "Gallery not found", status: 404 };
  }

  const comment = await db.galleryComment.findUnique({
    where: { id: input.commentId },
    select: { id: true, viewerId: true, galleryId: true },
  });

  if (!comment || comment.galleryId !== gallery.id) {
    return { error: "Comment not found", status: 404 };
  }

  // Determine ownership server-side, never trust the client
  const isOwner = input.isGalleryOwner === true || comment.viewerId === input.viewerId;
  // For public routes: only allow if viewer authored the comment
  // For dashboard routes: isGalleryOwner is set server-side by the dashboard service
  if (!isOwner) {
    return { error: "Not authorized", status: 403 };
  }

  await db.galleryComment.delete({ where: { id: input.commentId } });

  return listGalleryComments(input.shareToken);
};
