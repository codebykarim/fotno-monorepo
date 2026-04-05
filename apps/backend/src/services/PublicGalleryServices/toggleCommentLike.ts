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
    select: { id: true, likes: true, galleryId: true },
  });

  if (!comment) {
    return { error: "Comment not found", status: 404 };
  }

  const alreadyLiked = (comment.likes as string[]).includes(input.viewerId);

  // Use raw SQL for atomic array manipulation to avoid read-modify-write race conditions
  if (alreadyLiked) {
    await db.$executeRaw`
      UPDATE "gallery_comment"
      SET "likes" = (
        SELECT jsonb_agg(elem)
        FROM jsonb_array_elements("likes") AS elem
        WHERE elem #>> '{}' != ${input.viewerId}
      )
      WHERE "id" = ${input.commentId}
    `;
  } else {
    await db.$executeRaw`
      UPDATE "gallery_comment"
      SET "likes" = "likes" || ${JSON.stringify([input.viewerId])}::jsonb
      WHERE "id" = ${input.commentId}
      AND NOT ("likes" @> ${JSON.stringify([input.viewerId])}::jsonb)
    `;
  }

  return listGalleryComments(input.shareToken);
};
