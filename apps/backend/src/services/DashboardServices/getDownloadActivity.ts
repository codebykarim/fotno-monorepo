import { db } from "./_shared";

export const getDownloadActivity = async (
  userId: string,
  galleryId: string,
  limit = 50,
  offset = 0,
) => {
  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { id: true },
  });
  if (!gallery) {
    return null;
  }

  const [events, total] = await Promise.all([
    db.downloadEvent.findMany({
      where: { galleryId },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    }),
    db.downloadEvent.count({ where: { galleryId } }),
  ]);

  return {
    total,
    events: events.map((e: any) => ({
      id: e.id,
      photoId: e.photoId ?? null,
      viewerName: e.viewerName ?? null,
      type: e.type,
      createdAt: e.createdAt.toISOString(),
    })),
  };
};
