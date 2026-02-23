import { db } from "./_shared";

export const getOverview = async (userId: string) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [totalGalleries, publishedGalleries, totalPhotos, lovedPhotos, recentUploads7d, recentPhotos, recentGalleries] =
    await Promise.all([
      db.gallery.count({ where: { userId } }),
      db.gallery.count({ where: { userId, isPublished: true } }),
      db.photo.count({ where: { gallery: { userId } } }),
      db.photo.count({ where: { gallery: { userId }, loved: true } }),
      db.photo.count({
        where: {
          gallery: { userId },
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      }),
      db.photo.findMany({
        where: { gallery: { userId } },
        select: {
          id: true,
          originalFilename: true,
          createdAt: true,
          gallery: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      db.gallery.findMany({
        where: { userId },
        select: { id: true, title: true, updatedAt: true, createdAt: true },
        orderBy: { updatedAt: "desc" },
        take: 6,
      }),
    ]);

  const activity = [
    ...recentPhotos.map((photo: any) => ({
      id: `photo-${photo.id}`,
      message: `New upload: ${photo.originalFilename} in ${photo.gallery?.title ?? "gallery"}`,
      at:
        photo.createdAt instanceof Date
          ? photo.createdAt.toISOString()
          : String(photo.createdAt),
      type: "upload",
      severity: "success",
    })),
    ...recentGalleries.map((gallery: any) => ({
      id: `gallery-${gallery.id}`,
      message: `Gallery updated: ${gallery.title}`,
      at:
        gallery.updatedAt instanceof Date
          ? gallery.updatedAt.toISOString()
          : String(gallery.updatedAt),
      type: "gallery_update",
      severity: "info",
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 12);

  return {
    totalGalleries,
    publishedGalleries,
    totalPhotos,
    lovedPhotos,
    recentUploads7d,
    totalStorageUsedMb: Math.max(0, totalPhotos * 4.5),
    recentActivity: activity,
  };
};
