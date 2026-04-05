import { db } from "./_shared";
import { getPresignedDownloadUrl } from "../../utils/s3";

type SerializedComment = {
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

const THUMBNAIL_URL_TTL = 3600;

async function buildTree(rows: any[]): Promise<SerializedComment[]> {
  const map = new Map<string, SerializedComment>();

  for (const row of rows) {
    let photo: { thumbnailSrc: string } | null = null;
    if (row.photo) {
      const key = row.photo.thumbnailKey ?? row.photo.previewKey ?? row.photo.s3Key;
      if (key) {
        photo = { thumbnailSrc: await getPresignedDownloadUrl(key, THUMBNAIL_URL_TTL) };
      }
    }

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
      photo,
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

export const listGalleryComments = async (userId: string, galleryId: string) => {
  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { id: true },
  });

  if (!gallery) {
    return null;
  }

  const rows = await db.galleryComment.findMany({
    where: { galleryId: gallery.id },
    orderBy: { createdAt: "asc" },
    include: {
      photo: { select: { id: true, thumbnailKey: true, previewKey: true, s3Key: true } },
    },
  });

  return {
    comments: await buildTree(rows),
  };
};
