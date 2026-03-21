import { prisma } from "@workspace/db";
import { lsUpdateSubscription } from "./lemonSqueezy";
import { findTierByGb } from "../../constants/plans";
import { STORAGE_TIER_LIMITS } from "../../constants/storage";
import AppError from "../../errors/AppError";

export const changeTier = async ({
  userId,
  newStorageTierGb,
}: {
  userId: string;
  newStorageTierGb: number;
}): Promise<void> => {
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

  const newTier = findTierByGb(newStorageTierGb);
  if (!newTier || !newTier.lsVariantId) {
    throw new AppError("Invalid storage tier", 400);
  }

  if (subscription.storageTierGb === newStorageTierGb) {
    throw new AppError("Already on this tier", 400);
  }

  const normalizeGb = (gb: number) => (gb === -1 ? Infinity : gb);
  const isUpgrade = normalizeGb(newStorageTierGb) > normalizeGb(subscription.storageTierGb);

  if (
    subscription.source === "LEMON_SQUEEZY" &&
    subscription.lsSubscriptionId
  ) {
    const { error } = await lsUpdateSubscription(
      subscription.lsSubscriptionId,
      {
        variantId: Number(newTier.lsVariantId),
        invoiceImmediately: isUpgrade,
      },
    );

    if (error) {
      throw new AppError(
        `Failed to update subscription: ${error.message}`,
        500,
      );
    }
  }

  // For upgrades, apply immediately
  if (isUpgrade) {
    const newLimit = STORAGE_TIER_LIMITS[newStorageTierGb];
    await (prisma as any).$transaction([
      (prisma as any).subscription.update({
        where: { id: subscription.id },
        data: {
          storageTierGb: newStorageTierGb,
          priceCents: newTier.priceCents,
          lsVariantId: newTier.lsVariantId,
        },
      }),
      (prisma as any).user.update({
        where: { id: userId },
        data: {
          storageLimit: newLimit,
        },
      }),
    ]);
  }
  // For downgrades, the webhook will handle the change at period end
};
