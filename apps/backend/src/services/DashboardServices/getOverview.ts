import { db } from "./_shared";

export const getOverview = async (userId: string) => {
  const [totalGalleries, totalPhotos, recentPhotos, recentGalleries] =
    await Promise.all([
      db.gallery.count({ where: { userId } }),
      db.photo.count({ where: { gallery: { userId } } }),
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
      message: `Uploaded ${photo.originalFilename} to ${photo.gallery?.title ?? "gallery"}`,
      at:
        photo.createdAt instanceof Date
          ? photo.createdAt.toISOString()
          : String(photo.createdAt),
    })),
    ...recentGalleries.map((gallery: any) => ({
      id: `gallery-${gallery.id}`,
      message: `Updated gallery ${gallery.title}`,
      at:
        gallery.updatedAt instanceof Date
          ? gallery.updatedAt.toISOString()
          : String(gallery.updatedAt),
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 12);

  return {
    totalGalleries,
    totalPhotos,
    totalStorageUsedMb: Math.max(0, totalPhotos * 4.5),
    recentActivity: activity,
  };
};
