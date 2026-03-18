import { prisma } from "@workspace/db";
import { lsCancelSubscription } from "./lemonSqueezy";
import AppError from "../../errors/AppError";

export const cancelSubscription = async (userId: string): Promise<void> => {
  const subscription = await (prisma as any).subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
    orderBy: { createdAt: "desc" },
  });

  if (!subscription) {
    throw new AppError("No active subscription found", 404);
  }

  if (subscription.source === "LEMON_SQUEEZY" && subscription.lsSubscriptionId) {
    const { error } = await lsCancelSubscription(subscription.lsSubscriptionId);
    if (error) {
      throw new AppError(`Failed to cancel subscription: ${error.message}`, 500);
    }
  }

  await (prisma as any).subscription.update({
    where: { id: subscription.id },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
    },
  });
};
