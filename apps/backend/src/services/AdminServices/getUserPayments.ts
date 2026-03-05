import { db, toIsoOrNull } from "./_shared";

export const getUserPayments = async (userId: string) => {
  const payments = await db.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return payments.map((p: any) => ({
    id: p.id,
    plan: p.plan,
    status: p.status,
    amount_cents: p.amount_cents,
    planStartedAt: toIsoOrNull(p.planStartedAt),
    planExpiresAt: toIsoOrNull(p.planExpiresAt),
    createdAt: p.createdAt.toISOString(),
  }));
};
