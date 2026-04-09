import { prisma } from "@workspace/db";
import { stripe } from "./stripe";
import { findTierByGbFromDB } from "../../constants/plans";
import { fetchRegionalPricingFromDB } from "../../constants/regional-pricing";
import { extractBillingPeriod } from "./handleWebhook";
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

  const newTier = await findTierByGbFromDB(newStorageTierGb);
  if (!newTier || !newTier.stripePriceId) {
    throw new AppError("Invalid storage tier", 400);
  }

  const effectiveTierGb = subscription.pendingTierGb ?? subscription.storageTierGb;
  if (effectiveTierGb === newStorageTierGb) {
    throw new AppError("Already scheduled for or on this tier", 400);
  }

  if (
    !subscription.stripeSubscriptionId ||
    subscription.source !== "STRIPE"
  ) {
    throw new AppError("Only Stripe subscriptions can change tier", 400);
  }

  const normalizeGb = (gb: number) => (gb === -1 ? Infinity : gb);
  const isUpgrade = normalizeGb(newStorageTierGb) > normalizeGb(subscription.storageTierGb);

  console.log(
    `[changeTier] Scheduling ${isUpgrade ? "upgrade" : "downgrade"}: ` +
    `userId=${userId}, stripeSubId=${subscription.stripeSubscriptionId}, ` +
    `${subscription.storageTierGb}GB -> ${newStorageTierGb}GB (effective at period end)`,
  );

  // Retrieve the current subscription to get the item ID and period info
  const stripeSub = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
  const currentItem = stripeSub.items.data[0];

  if (!currentItem) {
    throw new AppError("Stripe subscription has no items", 500);
  }

  // Check if user has regional pricing (from subscription metadata)
  const countryCode = (stripeSub as any).metadata?.country_code as string | undefined;
  const regional =
    await fetchRegionalPricingFromDB(countryCode);
  const regionalCheckoutCents = regional?.tierCheckoutCents?.[newTier.gb];

  let itemUpdate: any;
  if (regionalCheckoutCents) {
    const existingPrice = await stripe.prices.retrieve(currentItem.price.id);
    itemUpdate = {
      id: currentItem.id,
      price_data: {
        currency: "usd",
        unit_amount: regionalCheckoutCents,
        recurring: { interval: "month" as const },
        product: existingPrice.product as string,
      },
    };
  } else {
    itemUpdate = {
      id: currentItem.id,
      price: newTier.stripePriceId,
    };
  }

  // Update Stripe — no proration, new price takes effect at next renewal
  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    items: [itemUpdate],
    proration_behavior: "none",
  });

  // Store as pending change (both upgrades and downgrades take effect at period end)
  const period = await extractBillingPeriod(stripeSub);

  await (prisma as any).subscription.update({
    where: { id: subscription.id },
    data: {
      pendingTierGb: newStorageTierGb === subscription.storageTierGb ? null : newStorageTierGb,
      pendingEffectiveAt: newStorageTierGb === subscription.storageTierGb ? null : period.end,
    },
  });

  console.log(
    `[changeTier] Change pending: userId=${userId}, ` +
    `${subscription.storageTierGb}GB -> ${newStorageTierGb}GB at ${period.end}`,
  );
};
