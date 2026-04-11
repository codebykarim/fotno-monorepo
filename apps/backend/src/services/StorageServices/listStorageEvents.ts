import { prisma } from "./_shared";

export const listStorageEvents = async (
  userId: string,
  limit: number,
  offset: number,
) => {
  const [events, total] = await Promise.all([
    prisma.storageEvent.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.storageEvent.count({
      where: { userId },
    }),
  ]);

  return {
    total,
    limit,
    offset,
    events: events.map((event: any) => ({
      ...event,
      delta: BigInt(event.delta).toString(),
    })),
  };
};
