import { db, bigIntToString } from "./_shared";

export const getStorageOverview = async () => {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      storageUsed: true,
      storageLimit: true,
      overageBytes: true,
    },
    orderBy: { storageUsed: "desc" },
  });

  let totalUsed = BigInt(0);
  let totalAllocated = BigInt(0);

  const mapped = users.map((u: any) => {
    const used = u.storageUsed ?? BigInt(0);
    const limit = u.storageLimit ?? BigInt(0);
    totalUsed += used;
    totalAllocated += limit;

    const usagePercent = limit > BigInt(0)
      ? Number((used * BigInt(10000)) / limit) / 100
      : 0;

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      plan: u.plan,
      storageUsed: bigIntToString(used),
      storageLimit: bigIntToString(limit),
      usagePercent: Math.round(usagePercent * 100) / 100,
      overageBytes: bigIntToString(u.overageBytes),
    };
  });

  const utilizationPercent = totalAllocated > BigInt(0)
    ? Number((totalUsed * BigInt(10000)) / totalAllocated) / 100
    : 0;

  return {
    totalUsed: bigIntToString(totalUsed),
    totalAllocated: bigIntToString(totalAllocated),
    utilizationPercent: Math.round(utilizationPercent * 100) / 100,
    users: mapped,
  };
};
