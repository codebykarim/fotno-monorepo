import { db } from "./_shared";
import { listGalleryComments } from "./listGalleryComments";

type ToggleLikeInput = {
  commentId: string;
  shareToken: string;
  viewerId: string;
};

export const toggleCommentLike = async (input: ToggleLikeInput) => {
  const comment = await db.galleryComment.findUnique({
    where: { id: input.commentId },
    select: { id: true, likes: true },
  });

  if (!comment) {
    return { error: "Comment not found", status: 404 };
  }

  const alreadyLiked = (comment.likes as string[]).includes(input.viewerId);
  const newLikes = alreadyLiked
    ? (comment.likes as string[]).filter((id: string) => id !== input.viewerId)
    : [...(comment.likes as string[]), input.viewerId];

  await db.galleryComment.update({
    where: { id: input.commentId },
    data: { likes: newLikes },
  });

  return listGalleryComments(input.shareToken);
};
