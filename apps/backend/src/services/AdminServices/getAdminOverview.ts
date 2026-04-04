import { db, bigIntToString } from "./_shared";

export const getAdminOverview = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const notAdmin = { role: { not: "admin" } };
  const userNotAdmin = { user: notAdmin };

  const [
    totalUsers,
    totalGalleries,
    totalPhotos,
    newUsersThisMonth,
    newGalleriesThisMonth,
    uploadsThisWeek,
    storageAgg,
    planBreakdown,
  ] = await Promise.all([
    db.user.count({ where: notAdmin }),
    db.gallery.count({ where: userNotAdmin }),
    db.photo.count({ where: { gallery: userNotAdmin } }),
    db.user.count({ where: { createdAt: { gte: startOfMonth }, ...notAdmin } }),
    db.gallery.count({ where: { createdAt: { gte: startOfMonth }, ...userNotAdmin } }),
    db.photo.count({ where: { createdAt: { gte: oneWeekAgo }, gallery: userNotAdmin } }),
    db.user.aggregate({ _sum: { storageUsed: true }, where: notAdmin }),
    db.user.groupBy({ by: ["plan"], _count: { plan: true }, where: notAdmin }),
  ]);

  return {
    totalUsers,
    totalGalleries,
    totalPhotos,
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
