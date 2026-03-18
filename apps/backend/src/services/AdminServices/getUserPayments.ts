import { db, toIsoOrNull } from "./_shared";

export const getUserSubscriptions = async (userId: string) => {
  const subscriptions = await db.subscription.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return subscriptions.map((s: any) => ({
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
  }));
};
