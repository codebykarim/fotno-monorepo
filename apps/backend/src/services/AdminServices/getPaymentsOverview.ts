import { db, toIsoOrNull } from "./_shared";

export const getPaymentsOverview = async (
  status: string,
  page: number,
  pageSize: number
) => {
  const where: any = {};
  if (status && status !== "all") {
    where.status = status;
  }

  const [payments, total, activeCount, cancelledCount, expiredCount, revenueAgg] =
    await Promise.all([
      db.payment.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.payment.count({ where }),
      db.payment.count({ where: { status: "ACTIVE" } }),
      db.payment.count({ where: { status: "CANCELLED" } }),
      db.payment.count({ where: { status: "EXPIRED" } }),
      db.payment.aggregate({ _sum: { amount_cents: true } }),
    ]);

  return {
    totalRevenue: revenueAgg._sum.amount_cents ?? 0,
    activeCount,
    cancelledCount,
    expiredCount,
    payments: payments.map((p: any) => ({
      id: p.id,
      plan: p.plan,
      status: p.status,
      amount_cents: p.amount_cents,
      planStartedAt: toIsoOrNull(p.planStartedAt),
      planExpiresAt: toIsoOrNull(p.planExpiresAt),
      createdAt: p.createdAt.toISOString(),
      user: p.user,
    })),
    total,
    page,
    pageSize,
  };
};
