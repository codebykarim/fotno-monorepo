import { prisma } from "@workspace/db";
import { lsUpdateSubscription, lsGetSubscription } from "./lemonSqueezy";
import { findTierByGb } from "../../constants/plans";
import { STORAGE_TIER_LIMITS } from "../../constants/storage";
import AppError from "../../errors/AppError";

/**
 * Directly query the LS API to find a customer's active subscription.
 * Bypasses the SDK to get raw diagnostics.
 */
async function findActiveSubscriptionFromLS(
  userEmail: string,
  storeId: string,
): Promise<string | null> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) return null;

  try {
    const url = new URL("https://api.lemonsqueezy.com/v1/subscriptions");
    url.searchParams.set("filter[store_id]", storeId);
    url.searchParams.set("filter[user_email]", userEmail);
    url.searchParams.set("filter[status]", "active");

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/vnd.api+json",
      },
    });

    const body = await res.json();
    console.log(
      `[changeTier:sync] LS API /subscriptions response (status=${res.status}):`,
      JSON.stringify(body, null, 2),
    );

    if (!res.ok || !body.data?.length) return null;

    // Return the first active subscription ID
    return String(body.data[0].id);
  } catch (err) {
    console.error("[changeTier:sync] Direct LS API call failed:", err);
    return null;
  }
}

/**
 * Try to find the correct LS subscription ID.
 * Handles cases where LS replaces a subscription with a new ID
 * (e.g. after variant changes, PPP re-creation).
 */
async function syncSubscriptionId(
  subscriptionId: string,
  userId: string,
): Promise<string | null> {
  const user = await (prisma as any).user.findUnique({
    where: { id: userId },
    select: { lsCustomerId: true, email: true },
  });

  console.log(
    `[changeTier:sync] Starting sync for userId=${userId}, staleId=${subscriptionId}, ` +
    `lsCustomerId=${user?.lsCustomerId ?? "MISSING"}, email=${user?.email ?? "MISSING"}`,
  );

  if (!user) return null;

  // Verify the current ID is truly invalid on LS
  try {
    const { data: subData, error: subError } = await lsGetSubscription(subscriptionId);
    if (subData && !subError) {
      console.log(
        `[changeTier:sync] Subscription ${subscriptionId} EXISTS on LS with ` +
        `status=${subData.data.attributes.status}, variant=${subData.data.attributes.variant_id}`,
      );
      return null; // ID is valid — the issue is something else (status? permissions?)
    }
    console.log(
      `[changeTier:sync] Confirmed ${subscriptionId} NOT FOUND on LS: ${subError?.message}`,
    );
  } catch (err) {
    console.error(`[changeTier:sync] getSubscription check failed:`, err);
  }

  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  if (!storeId) {
    console.error("[changeTier:sync] LEMONSQUEEZY_STORE_ID not configured");
    return null;
  }

  if (!user.email) {
    console.error("[changeTier:sync] User has no email, cannot search LS");
    return null;
  }

  // Use direct API call to find the customer's active subscription
  const newId = await findActiveSubscriptionFromLS(user.email, storeId);
  if (!newId || newId === subscriptionId) {
    console.warn(
      `[changeTier:sync] Could not find a different active subscription on LS ` +
      `(found=${newId ?? "none"})`,
    );
    return null;
  }

  console.log(
    `[changeTier:sync] Synced lsSubscriptionId: ${subscriptionId} → ${newId} for userId=${userId}`,
  );

  await (prisma as any).subscription.update({
    where: { lsSubscriptionId: subscriptionId },
    data: { lsSubscriptionId: newId },
  });

  return newId;
}

/**
 * After a successful LS update call, check if the subscription ID changed
 * in the response and update our local record.
 */
async function reconcileSubscriptionId(
  localSubId: string,
  dbSubscriptionId: string,
  responseData: any,
): Promise<void> {
  if (!responseData?.data?.id) return;
  const returnedId = String(responseData.data.id);
  if (returnedId !== localSubId) {
    console.log(
      `[changeTier] LS returned different subscription ID: ${localSubId} → ${returnedId}. Updating local record.`,
    );
    await (prisma as any).subscription.update({
      where: { id: dbSubscriptionId },
      data: { lsSubscriptionId: returnedId },
    });
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

    console.log(
      `[changeTier] Attempting ${isUpgrade ? "upgrade" : "downgrade"}: ` +
      `userId=${userId}, lsSubId=${lsSubId}, ` +
      `${subscription.storageTierGb}GB → ${newStorageTierGb}GB, ` +
      `newVariantId=${newTier.lsVariantId}, invoiceImmediately=${isUpgrade}`,
    );

    const { data: updateData, error } = await lsUpdateSubscription(lsSubId, {
      variantId: Number(newTier.lsVariantId),
      invoiceImmediately: isUpgrade,
    });

    if (error) {
      if (error.message === "Not Found") {
        console.warn(
          `[changeTier] LS returned "Not Found" for lsSubscriptionId=${lsSubId}. Attempting sync...`,
        );
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
          // Track if LS returned yet another ID
          await reconcileSubscriptionId(syncedId, subscription.id, retry.data);
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
    } else {
      // Success — check if LS returned a different subscription ID
      await reconcileSubscriptionId(lsSubId, subscription.id, updateData);
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
