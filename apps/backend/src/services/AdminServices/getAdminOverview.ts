import { db, bigIntToString } from "./_shared";

export const getAdminOverview = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalGalleries,
    totalPhotos,
    totalClients,
    newUsersThisMonth,
    newGalleriesThisMonth,
    uploadsThisWeek,
    storageAgg,
    planBreakdown,
  ] = await Promise.all([
    db.user.count(),
    db.gallery.count(),
    db.photo.count(),
    db.client.count(),
    db.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.gallery.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.photo.count({ where: { createdAt: { gte: oneWeekAgo } } }),
    db.user.aggregate({ _sum: { storageUsed: true } }),
    db.user.groupBy({ by: ["plan"], _count: { plan: true } }),
  ]);

  return {
    totalUsers,
    totalGalleries,
    totalPhotos,
    totalClients,
    newUsersThisMonth,
    newGalleriesThisMonth,
    uploadsThisWeek,
    platformStorageUsed: bigIntToString(storageAgg._sum.storageUsed),
    planBreakdown: planBreakdown.map((p: any) => ({
      plan: p.plan,
      count: p._count.plan,
    })),
  };
};
