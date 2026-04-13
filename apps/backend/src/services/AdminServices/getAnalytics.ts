import { db, bigIntToString } from "./_shared";

export const getAnalytics = async (period: string) => {
  const days = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const notAdmin = { role: { not: "admin" } };
  const userNotAdmin = { user: notAdmin };

  const [
    userSignups,
    galleryCreations,
    uploadVolume,
    revenueByMonth,
    planDistribution,
    countryDistribution,
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
        AND "role" IS DISTINCT FROM 'admin'
      GROUP BY DATE("createdAt")
      ORDER BY date
    `,
    db.$queryRaw`
      SELECT DATE(g."createdAt") as date, COUNT(*)::int as count
      FROM "gallery" g
      JOIN "user" u ON g."userId" = u."id"
      WHERE g."createdAt" >= ${since}
        AND u."role" IS DISTINCT FROM 'admin'
      GROUP BY DATE(g."createdAt")
      ORDER BY date
    `,
    db.$queryRaw`
      SELECT DATE(p."createdAt") as date, COUNT(*)::int as count, SUM(p."totalSize") as bytes
      FROM "photo" p
      JOIN "gallery" g ON p."galleryId" = g."id"
      JOIN "user" u ON g."userId" = u."id"
      WHERE p."createdAt" >= ${since}
        AND u."role" IS DISTINCT FROM 'admin'
      GROUP BY DATE(p."createdAt")
      ORDER BY date
    `,
    db.$queryRaw`
      SELECT DATE_TRUNC('month', s."createdAt") as month, SUM(s."priceCents")::int as total_cents
      FROM "subscription" s
      JOIN "user" u ON s."userId" = u."id"
      WHERE s."createdAt" >= ${since}
        AND u."role" IS DISTINCT FROM 'admin'
      GROUP BY DATE_TRUNC('month', s."createdAt")
      ORDER BY month
    `,
    db.user.groupBy({ by: ["plan"], _count: { plan: true }, where: notAdmin }),
    db.$queryRaw`
      SELECT "country", COUNT(*)::int as count
      FROM "user"
      WHERE "role" IS DISTINCT FROM 'admin'
        AND "country" IS NOT NULL
      GROUP BY "country"
      ORDER BY count DESC
    `,
    db.$queryRaw`
      SELECT DATE(se."createdAt") as date, SUM(se."delta") as delta
      FROM "storage_event" se
      JOIN "user" u ON se."userId" = u."id"
      WHERE se."createdAt" >= ${since}
        AND u."role" IS DISTINCT FROM 'admin'
      GROUP BY DATE(se."createdAt")
      ORDER BY date
    `,
    db.subscription.aggregate({ _sum: { priceCents: true }, where: userNotAdmin }),
    db.subscription.count({ where: { status: "ACTIVE", ...userNotAdmin } }),
    db.user.count({ where: notAdmin }),
    db.gallery.count({ where: userNotAdmin }),
    db.photo.count({ where: { gallery: userNotAdmin } }),
  ]);

  const totalRevenueValue = totalRevenue._sum.priceCents ?? 0;
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
    countryDistribution: (countryDistribution as any[]).map((r) => ({
      country: r.country,
      count: Number(r.count),
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
