import { db } from "./_shared";
import { listGalleryComments } from "./listGalleryComments";

type DeleteCommentInput = {
  commentId: string;
  shareToken: string;
  viewerId: string;
  isGalleryOwner: boolean;
};

export const deleteGalleryComment = async (input: DeleteCommentInput) => {
  const comment = await db.galleryComment.findUnique({
    where: { id: input.commentId },
    select: { id: true, viewerId: true },
  });

  if (!comment) {
    return { error: "Comment not found", status: 404 };
  }

  const canDelete = input.isGalleryOwner || comment.viewerId === input.viewerId;
  if (!canDelete) {
    return { error: "Not authorized", status: 403 };
  }

  await db.galleryComment.delete({ where: { id: input.commentId } });

  return listGalleryComments(input.shareToken);
};
