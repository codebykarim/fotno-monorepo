import { db, bigIntToString } from "./_shared";

export const getAnalytics = async (period: string) => {
  const days = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [
    userSignups,
    galleryCreations,
    uploadVolume,
    revenueByMonth,
    planDistribution,
    storageGrowth,
    totalRevenue,
    activeSubCount,
    totalUsers,
    totalGalleries,
    totalPhotos,
  ] = await Promise.all([
    db.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count
      FROM "user"
      WHERE "createdAt" >= ${since}
      GROUP BY DATE("createdAt")
      ORDER BY date
    `,
    db.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count
      FROM "gallery"
      WHERE "createdAt" >= ${since}
      GROUP BY DATE("createdAt")
      ORDER BY date
    `,
    db.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count, SUM("totalSize") as bytes
      FROM "photo"
      WHERE "createdAt" >= ${since}
      GROUP BY DATE("createdAt")
      ORDER BY date
    `,
    db.$queryRaw`
      SELECT DATE_TRUNC('month', "createdAt") as month, SUM("amount_cents")::int as total_cents
      FROM "payment"
      WHERE "createdAt" >= ${since}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month
    `,
    db.user.groupBy({ by: ["plan"], _count: { plan: true } }),
    db.$queryRaw`
      SELECT DATE("createdAt") as date, SUM("delta") as delta
      FROM "storage_event"
      WHERE "createdAt" >= ${since}
      GROUP BY DATE("createdAt")
      ORDER BY date
    `,
    db.payment.aggregate({ _sum: { amount_cents: true } }),
    db.payment.count({ where: { status: "ACTIVE" } }),
    db.user.count(),
    db.gallery.count(),
    db.photo.count(),
  ]);

  const totalRevenueValue = totalRevenue._sum.amount_cents ?? 0;
  const mrr = activeSubCount > 0
    ? Math.round(totalRevenueValue / Math.max(1, Math.ceil(days / 30)))
    : 0;

  return {
    userSignups: (userSignups as any[]).map((r) => ({
      date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date),
      count: Number(r.count),
    })),
    galleryCreations: (galleryCreations as any[]).map((r) => ({
      date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date),
      count: Number(r.count),
    })),
    uploadVolume: (uploadVolume as any[]).map((r) => ({
      date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date),
      count: Number(r.count),
      bytes: bigIntToString(r.bytes),
    })),
    revenueByMonth: (revenueByMonth as any[]).map((r) => ({
      month: r.month instanceof Date ? r.month.toISOString().slice(0, 7) : String(r.month),
      total_cents: Number(r.total_cents),
    })),
    planDistribution: (planDistribution as any[]).map((p) => ({
      plan: p.plan,
      count: p._count.plan,
    })),
    storageGrowth: (storageGrowth as any[]).map((r) => ({
      date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date),
      delta: bigIntToString(r.delta),
    })),
    summary: {
      totalRevenue: totalRevenueValue,
      mrr,
      avgGalleriesPerUser: totalUsers > 0 ? Math.round((totalGalleries / totalUsers) * 100) / 100 : 0,
      avgPhotosPerGallery: totalGalleries > 0 ? Math.round((totalPhotos / totalGalleries) * 100) / 100 : 0,
    },
  };
};
