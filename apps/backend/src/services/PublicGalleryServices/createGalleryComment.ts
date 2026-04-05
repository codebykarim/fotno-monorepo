import { db } from "./_shared";
import { listGalleryComments } from "./listGalleryComments";
import { sendNotification } from "../../utils/fcm";

const MAX_COMMENT_LENGTH = 2000;
const MAX_AUTHOR_NAME_LENGTH = 100;

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
  if (input.message.length > MAX_COMMENT_LENGTH) {
    return { error: `Message must be ${MAX_COMMENT_LENGTH} characters or fewer`, status: 400 };
  }

  const gallery = await db.gallery.findFirst({
    where: { OR: [{ shareToken: input.shareToken }, { slug: input.shareToken }] },
    select: { id: true, slug: true, userId: true, title: true },
  });

  if (!gallery) {
    return { error: "Gallery not found", status: 404 };
  }

  const authorName = (input.authorName?.trim() || "Client").slice(0, MAX_AUTHOR_NAME_LENGTH);
  // Only trust authorRole if the caller is verified as the gallery owner (set by dashboard service)
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

  // Notify the gallery owner when a non-photographer posts a comment
  if (authorRole !== "photographer" && gallery.userId) {
    sendNotification(
      gallery.userId,
      "comments",
      "New comment on your gallery",
      `${authorName} commented on "${gallery.title}"`,
      { galleryId: gallery.id },
    ).catch((err) => console.error("[Notification] Failed to send comment notification:", err));
  }

  return listGalleryComments(input.shareToken);
};
