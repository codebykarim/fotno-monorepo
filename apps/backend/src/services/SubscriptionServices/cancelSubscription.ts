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
    if (error && !error.message?.includes("Not Found")) {
      throw new AppError(`Failed to cancel subscription: ${error.message}`, 500);
    }
  }

  // If user is in free trial, cancel immediately with no grace period
  const user = await (prisma as any).user.findUnique({
    where: { id: userId },
    select: { trialEndsAt: true },
  });
  const TRIAL_DAYS = 14;
  const subscriptionAgeDays = subscription.createdAt
    ? (Date.now() - new Date(subscription.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    : Infinity;
  const isTrialing =
    (user?.trialEndsAt && new Date(user.trialEndsAt) > new Date()) ||
    subscriptionAgeDays <= TRIAL_DAYS;

  if (isTrialing) {
    const ONE_GB = BigInt(1073741824);
    await (prisma as any).$transaction(async (tx: any) => {
      await tx.subscription.update({
        where: { id: subscription.id },
        data: { status: "EXPIRED", cancelledAt: new Date() },
      });
      await tx.user.update({
        where: { id: userId },
        data: {
          plan: "FREE",
          subscribed: false,
          trialEndsAt: null,
          storageLimit: ONE_GB,
          galleryLimit: 2,
          downgradedAt: new Date(),
        },
      });
      // Auto-draft galleries beyond the 2-gallery limit
      const publishedGalleries = await tx.gallery.findMany({
        where: { userId, isPublished: true },
        orderBy: { updatedAt: "desc" },
        select: { id: true },
      });
      if (publishedGalleries.length > 2) {
        const toDraft = publishedGalleries.slice(2).map((g: any) => g.id);
        await tx.gallery.updateMany({
          where: { id: { in: toDraft } },
          data: { isPublished: false },
        });
      }
    });
  } else {
    await (prisma as any).subscription.update({
      where: { id: subscription.id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    });
  }
};
