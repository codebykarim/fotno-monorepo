import { db, bigIntToString, toIsoOrNull } from "./_shared";

export const getUser = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      _count: { select: { galleries: true } },
      payment: {
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
    payments: user.payment.map((p: any) => ({
      id: p.id,
      plan: p.plan,
      status: p.status,
      amount_cents: p.amount_cents,
      planStartedAt: toIsoOrNull(p.planStartedAt),
      planExpiresAt: toIsoOrNull(p.planExpiresAt),
      createdAt: p.createdAt.toISOString(),
    })),
  };
};
