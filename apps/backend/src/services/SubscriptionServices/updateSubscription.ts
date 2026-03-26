import { prisma } from "@workspace/db";
import { stripe } from "./stripe";
import { findTierByGb } from "../../constants/plans";
import { storageTierToBytes } from "../../constants/storage";
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
  if (!newTier || !newTier.stripePriceId) {
    throw new AppError("Invalid storage tier", 400);
  }

  if (subscription.storageTierGb === newStorageTierGb) {
    throw new AppError("Already on this tier", 400);
  }

  const normalizeGb = (gb: number) => (gb === -1 ? Infinity : gb);
  const isUpgrade = normalizeGb(newStorageTierGb) > normalizeGb(subscription.storageTierGb);

  if (
    subscription.source === "STRIPE" &&
    subscription.stripeSubscriptionId
  ) {
    console.log(
      `[changeTier] Attempting ${isUpgrade ? "upgrade" : "downgrade"}: ` +
      `userId=${userId}, stripeSubId=${subscription.stripeSubscriptionId}, ` +
      `${subscription.storageTierGb}GB -> ${newStorageTierGb}GB`,
    );

    // Retrieve the current subscription to get the item ID
    const stripeSub = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
    const currentItem = stripeSub.items.data[0];

    if (!currentItem) {
      throw new AppError("Stripe subscription has no items", 500);
    }

    // Update the subscription item to the new price
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [
        {
          id: currentItem.id,
          price: newTier.stripePriceId,
        },
      ],
      proration_behavior: isUpgrade ? "create_prorations" : "none",
    });
  }

  // For upgrades, apply immediately
  if (isUpgrade) {
    const newLimit = storageTierToBytes(newStorageTierGb);
    await (prisma as any).$transaction([
      (prisma as any).subscription.update({
        where: { id: subscription.id },
        data: {
          storageTierGb: newStorageTierGb,
          priceCents: newTier.priceCents,
          stripePriceId: newTier.stripePriceId,
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
