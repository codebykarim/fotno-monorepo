import { prisma } from "@workspace/db";

export const getActiveSubscription = async (userId: string) => {
  const subscription = await (prisma as any).subscription.findFirst({
    where: {
      userId,
      status: { in: ["ACTIVE", "CANCELLED", "PAST_DUE"] },
    },
    orderBy: { createdAt: "desc" },
  });

  return subscription;
};
