import { db, bigIntToString } from "./_shared";

const GALLERY_FULL_MARKS = 5;
const UPLOAD_FULL_MARKS_BYTES = 5n * 1024n * 1024n * 1024n; // 5 GB
const AT_RISK_THRESHOLD = 30;

const computeHealthScore = (
  galleries: number,
  uploadBytes: bigint,
  netDelta: bigint,
): { healthScore: number; storageTrend: "up" | "flat" | "down" } => {
  const galleryPts = Math.min(galleries / GALLERY_FULL_MARKS, 1) * 40;

  const uploadRatio =
    UPLOAD_FULL_MARKS_BYTES > 0n
      ? Number((uploadBytes * 1000n) / UPLOAD_FULL_MARKS_BYTES) / 1000
      : 0;
  const uploadPts = Math.min(Math.max(uploadRatio, 0), 1) * 40;

  let trendPts = 10;
  let storageTrend: "up" | "flat" | "down" = "flat";
  if (netDelta > 0n) {
    trendPts = 20;
    storageTrend = "up";
  } else if (netDelta < 0n) {
    trendPts = 0;
    storageTrend = "down";
  }

  const score = Math.round(galleryPts + uploadPts + trendPts);
  return {
    healthScore: Math.max(0, Math.min(100, score)),
    storageTrend,
  };
};

export const listUsers = async (
  search: string,
  plan: string,
  page: number,
  pageSize: number
) => {
  const where: any = { role: { not: "admin" } };

  if (search) {
    where.AND = [
      {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
    ];
  }

  if (plan && plan !== "all") {
    where.plan = plan;
  }

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        plan: true,
        role: true,
        banned: true,
        country: true,
        storageUsed: true,
        storageLimit: true,
        createdAt: true,
        _count: { select: { galleries: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.user.count({ where }),
  ]);

  const userIds = users.map((u: any) => u.id);
  const now = new Date();
  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
  );

  const [galleryAgg, netDeltaAgg, uploadAgg, emailCountAgg, lastEmails] =
    await Promise.all([
      userIds.length === 0
        ? Promise.resolve([])
        : db.gallery.groupBy({
            by: ["userId"],
            where: { userId: { in: userIds }, createdAt: { gte: monthStart } },
            _count: { _all: true },
          }),
      userIds.length === 0
        ? Promise.resolve([])
        : db.storageEvent.groupBy({
            by: ["userId"],
            where: { userId: { in: userIds }, createdAt: { gte: monthStart } },
            _sum: { delta: true },
          }),
      userIds.length === 0
        ? Promise.resolve([])
        : db.storageEvent.groupBy({
            by: ["userId"],
            where: {
              userId: { in: userIds },
              createdAt: { gte: monthStart },
              delta: { gt: 0 },
            },
            _sum: { delta: true },
          }),
      userIds.length === 0
        ? Promise.resolve([])
        : db.adminMessageLog.groupBy({
            by: ["userId"],
            where: { userId: { in: userIds } },
            _count: { _all: true },
          }),
      userIds.length === 0
        ? Promise.resolve([])
        : db.$queryRaw<
            { userId: string; preset: string; sentAt: Date }[]
          >`SELECT DISTINCT ON ("userId") "userId", "preset", "sentAt"
            FROM "admin_message_log"
            WHERE "userId" = ANY(${userIds})
            ORDER BY "userId", "sentAt" DESC`,
    ]);

  const galleryMap = new Map<string, number>();
  for (const row of galleryAgg) {
    galleryMap.set(row.userId, row._count?._all ?? 0);
  }
  const netDeltaMap = new Map<string, bigint>();
  for (const row of netDeltaAgg) {
    netDeltaMap.set(row.userId, BigInt(row._sum?.delta ?? 0));
  }
  const uploadMap = new Map<string, bigint>();
  for (const row of uploadAgg) {
    uploadMap.set(row.userId, BigInt(row._sum?.delta ?? 0));
  }
  const emailCountMap = new Map<string, number>();
  for (const row of emailCountAgg) {
    emailCountMap.set(row.userId, row._count?._all ?? 0);
  }
  const lastEmailMap = new Map<string, { preset: string; sentAt: string }>();
  for (const row of lastEmails) {
    lastEmailMap.set(row.userId, {
      preset: row.preset,
      sentAt: row.sentAt.toISOString(),
    });
  }

  return {
    data: users.map((u: any) => {
      const galleries = galleryMap.get(u.id) ?? 0;
      const uploadBytes = uploadMap.get(u.id) ?? 0n;
      const netDelta = netDeltaMap.get(u.id) ?? 0n;
      const { healthScore, storageTrend } = computeHealthScore(
        galleries,
        uploadBytes,
        netDelta
      );
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        image: u.image,
        plan: u.plan,
        role: u.role,
        banned: Boolean(u.banned),
        country: u.country ?? null,
        storageUsed: bigIntToString(u.storageUsed),
        storageLimit: bigIntToString(u.storageLimit),
        galleryCount: u._count.galleries,
        createdAt: u.createdAt.toISOString(),
        galleriesThisMonth: galleries,
        uploadBytesThisMonth: bigIntToString(uploadBytes),
        storageTrend,
        healthScore,
        atRisk: healthScore < AT_RISK_THRESHOLD,
        emailCount: emailCountMap.get(u.id) ?? 0,
        lastEmail: lastEmailMap.get(u.id) ?? null,
      };
    }),
    total,
    page,
    pageSize,
  };
};
