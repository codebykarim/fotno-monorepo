import { db, bigIntToString } from "./_shared";

export const getUserStorage = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      storageUsed: true,
      storageLimit: true,
      storageReserved: true,
      overageBytes: true,
    },
  });

  if (!user) return null;

  const events = await db.storageEvent.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      delta: true,
      reason: true,
      photoId: true,
      createdAt: true,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    plan: user.plan,
    storageUsed: bigIntToString(user.storageUsed),
    storageLimit: bigIntToString(user.storageLimit),
    storageReserved: bigIntToString(user.storageReserved),
    overageBytes: bigIntToString(user.overageBytes),
    events: events.map((e: any) => ({
      id: e.id,
      delta: bigIntToString(e.delta),
      reason: e.reason,
      photoId: e.photoId,
      createdAt: e.createdAt.toISOString(),
    })),
  };
};
