import { db } from "./_shared";

export type SerializedComment = {
  id: string;
  authorName: string;
  authorRole: "client" | "photographer";
  message: string;
  photoId: string | null;
  parentId: string | null;
  likes: string[];
  createdAt: string;
  updatedAt: string;
  photo: { thumbnailSrc: string } | null;
  viewerId: string | null;
  replies: SerializedComment[];
};

function buildThumbnailSrc(photoId: string, shareToken: string): string {
  return `/api/photos/${photoId}/proxy?variant=thumbnail&shareToken=${encodeURIComponent(shareToken)}`;
}

function buildTree(rows: any[], shareToken: string): SerializedComment[] {
  const map = new Map<string, SerializedComment>();

  for (const row of rows) {
    map.set(row.id, {
      id: row.id,
      authorName: row.authorName,
      authorRole: row.authorRole === "photographer" ? "photographer" : "client",
      message: row.message,
      photoId: row.photoId,
      parentId: row.parentId,
      likes: row.likes ?? [],
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      photo: row.photo
        ? { thumbnailSrc: buildThumbnailSrc(row.photo.id, shareToken) }
        : null,
      viewerId: row.viewerId,
      replies: [],
    });
  }

  const roots: SerializedComment[] = [];

  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  roots.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return roots;
}

export const listGalleryComments = async (shareToken: string) => {
  const gallery = await db.gallery.findFirst({
    where: { OR: [{ shareToken }, { slug: shareToken }] },
    select: { id: true, slug: true },
  });

  if (!gallery) {
    return { comments: [] };
  }

  const rows = await db.galleryComment.findMany({
    where: { galleryId: gallery.id },
    orderBy: { createdAt: "asc" },
    include: {
      photo: { select: { id: true, thumbnailKey: true } },
    },
  });

  return {
    comments: buildTree(rows, gallery.slug),
  };
};
