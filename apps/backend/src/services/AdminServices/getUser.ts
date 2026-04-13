import { db, bigIntToString, toIsoOrNull } from "./_shared";

export const getUser = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      _count: { select: { galleries: true } },
      subscriptions: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    plan: user.plan,
    role: user.role,
    banned: Boolean(user.banned),
    country: user.country ?? null,
    banReason: user.banReason,
    banExpires: toIsoOrNull(user.banExpires),
    subscribed: user.subscribed,
    finishOnboarding: user.finishOnboarding,
    storageUsed: bigIntToString(user.storageUsed),
    storageLimit: bigIntToString(user.storageLimit),
    storageReserved: bigIntToString(user.storageReserved),
    overageBytes: bigIntToString(user.overageBytes),
    galleryCount: user._count.galleries,
    createdAt: user.createdAt.toISOString(),
    subscriptions: user.subscriptions.map((s: any) => ({
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
    })),
  };
};
