import { db } from "./_shared";
import { listGalleryComments } from "./listGalleryComments";

type EditCommentInput = {
  commentId: string;
  shareToken: string;
  viewerId: string;
  message: string;
};

export const editGalleryComment = async (input: EditCommentInput) => {
  const comment = await db.galleryComment.findUnique({
    where: { id: input.commentId },
    select: { id: true, viewerId: true, gallery: { select: { shareToken: true, slug: true } } },
  });

  if (!comment) {
    return { error: "Comment not found", status: 404 };
  }

  if (comment.viewerId !== input.viewerId) {
    return { error: "Not authorized", status: 403 };
  }

  await db.galleryComment.update({
    where: { id: input.commentId },
    data: { message: input.message },
  });

  return listGalleryComments(input.shareToken);
};
