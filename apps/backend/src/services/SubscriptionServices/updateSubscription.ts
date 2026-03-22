import { prisma } from "@workspace/db";
import { lsUpdateSubscription, lsListSubscriptions } from "./lemonSqueezy";
import { findTierByGb } from "../../constants/plans";
import { STORAGE_TIER_LIMITS } from "../../constants/storage";
import AppError from "../../errors/AppError";

/**
 * Try to find the correct LS subscription ID by querying the LS API
 * using the customer's lsCustomerId. This handles cases where the
 * subscription ID changes on LS's side (e.g. PPP/custom pricing re-creation).
 */
async function syncSubscriptionId(
  subscriptionId: string,
  userId: string,
): Promise<string | null> {
  const user = await (prisma as any).user.findUnique({
    where: { id: userId },
    select: { lsCustomerId: true },
  });
  if (!user?.lsCustomerId) return null;

  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  if (!storeId) return null;

  try {
    const { data, error } = await lsListSubscriptions({
      filter: {
        storeId: Number(storeId),
        userEmail: undefined,
        status: "active",
      },
    });

    if (error || !data?.data) return null;

    // Find the subscription belonging to this customer
    const match = data.data.find(
      (sub: any) =>
        String(sub.attributes.customer_id) === user.lsCustomerId &&
        sub.attributes.status === "active",
    );
    if (!match) return null;

    const newLsSubId = String(match.id);
    if (newLsSubId === subscriptionId) return null; // Same ID, no fix needed

    console.log(
      `[changeTier] Synced lsSubscriptionId: ${subscriptionId} → ${newLsSubId} for userId=${userId}`,
    );

    // Update the local record
    await (prisma as any).subscription.update({
      where: { lsSubscriptionId: subscriptionId },
      data: { lsSubscriptionId: newLsSubId },
    });

    return newLsSubId;
  } catch (err) {
    console.error("[changeTier] Failed to sync subscription ID from LS:", err);
    return null;
  }
}

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
    let lsSubId = subscription.lsSubscriptionId;

    const { error } = await lsUpdateSubscription(lsSubId, {
      variantId: Number(newTier.lsVariantId),
      invoiceImmediately: isUpgrade,
    });

    if (error) {
      // If "Not Found", the LS subscription ID may have changed — try to sync
      if (error.message === "Not Found") {
        const syncedId = await syncSubscriptionId(lsSubId, userId);
        if (syncedId) {
          const retry = await lsUpdateSubscription(syncedId, {
            variantId: Number(newTier.lsVariantId),
            invoiceImmediately: isUpgrade,
          });
          if (retry.error) {
            throw new AppError(
              `Failed to update subscription after sync: ${retry.error.message}`,
              500,
            );
          }
          // Success after sync — continue to DB update below
        } else {
          throw new AppError(
            `Failed to update subscription: ${error.message}. Could not sync subscription ID from Lemon Squeezy.`,
            500,
          );
        }
      } else {
        throw new AppError(
          `Failed to update subscription: ${error.message}`,
          500,
        );
      }
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
