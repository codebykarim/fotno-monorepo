import { db, toIsoOrNull } from "./_shared";

export const getPaymentsOverview = async (
  status: string,
  source: string,
  page: number,
  pageSize: number
) => {
  const where: any = {};
  if (status && status !== "all") {
    where.status = status;
  }
  if (source && source !== "all") {
    where.source = source;
  }

  const [subscriptions, total, activeCount, cancelledCount, expiredCount, pastDueCount, revenueAgg] =
    await Promise.all([
      db.subscription.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.subscription.count({ where }),
      db.subscription.count({ where: { status: "ACTIVE" } }),
      db.subscription.count({ where: { status: "CANCELLED" } }),
      db.subscription.count({ where: { status: "EXPIRED" } }),
      db.subscription.count({ where: { status: "PAST_DUE" } }),
      db.subscription.aggregate({ _sum: { priceCents: true } }),
    ]);

  return {
    totalRevenue: revenueAgg._sum.priceCents ?? 0,
    activeCount,
    cancelledCount,
    expiredCount,
    pastDueCount,
    subscriptions: subscriptions.map((s: any) => ({
      id: s.id,
      source: s.source,
      status: s.status,
      storageTierGb: s.storageTierGb,
      priceCents: s.priceCents,
      currency: s.currency,
      currentPeriodStart: toIsoOrNull(s.currentPeriodStart),
      currentPeriodEnd: toIsoOrNull(s.currentPeriodEnd),
      cancelledAt: toIsoOrNull(s.cancelledAt),
      endsAt: toIsoOrNull(s.endsAt),
      createdAt: s.createdAt.toISOString(),
      user: s.user,
    })),
    total,
    page,
    pageSize,
  };
};
