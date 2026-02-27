import { db } from "./_shared";
import { listGalleryComments } from "./listGalleryComments";

type CreateCommentInput = {
  shareToken: string;
  authorName?: string;
  authorRole?: string;
  message: string;
  photoId?: string | null;
  parentId?: string | null;
  viewerId?: string | null;
};

export const createGalleryComment = async (input: CreateCommentInput) => {
  const gallery = await db.gallery.findFirst({
    where: { OR: [{ shareToken: input.shareToken }, { slug: input.shareToken }] },
    select: { id: true, slug: true },
  });

  if (!gallery) {
    return { error: "Gallery not found", status: 404 };
  }

  const authorName = input.authorName?.trim() || "Client";
  const authorRole =
    input.authorRole === "photographer" ? "photographer" : "client";

  await db.galleryComment.create({
    data: {
      galleryId: gallery.id,
      authorName,
      authorRole,
      message: input.message,
      photoId: input.photoId ?? null,
      parentId: input.parentId ?? null,
      viewerId: input.viewerId ?? null,
    },
  });

  return listGalleryComments(input.shareToken);
};
