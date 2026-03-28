import { stripe } from "./stripe";
import { findTierByGb, fetchTiersFromDB } from "../../constants/plans";
import { getRegionalPricing, fetchRegionalPricingFromDB } from "../../constants/regional-pricing";
import AppError from "../../errors/AppError";

export const createCheckout = async ({
  userId,
  email,
  name,
  storageTierGb,
  countryCode,
}: {
  userId: string;
  email: string;
  name?: string;
  storageTierGb: number;
  countryCode?: string;
}): Promise<{ checkoutUrl: string }> => {
  if (storageTierGb === 0) {
    throw new AppError("Cannot create a checkout for the free tier", 400);
  }

  if (!stripe) {
    throw new AppError("Payment system not configured", 500);
  }

  // Apply PPP-adjusted price for regional users (DB first, hardcoded fallback)
  const regional =
    (await fetchRegionalPricingFromDB(countryCode)) ?? getRegionalPricing(countryCode);

  // Look up tier from DB-backed tiers
  const dbTiers = await fetchTiersFromDB();
  const findDbTier = (gb: number) => dbTiers.find((t) => t.gb === gb);

  // Direct lookup first; if it fails, check if the gb value is a regional override
  let tier = findDbTier(storageTierGb) ?? findTierByGb(storageTierGb);
  if (!tier && regional?.tierStorageOverrides) {
    const originalGb = Object.entries(regional.tierStorageOverrides)
      .find(([, overridden]) => overridden === storageTierGb)?.[0];
    if (originalGb) tier = findDbTier(Number(originalGb)) ?? findTierByGb(Number(originalGb));
  }
  if (!tier || !tier.stripePriceId) {
    throw new AppError("Invalid storage tier", 400);
  }

  const storageGb = regional?.tierStorageOverrides?.[tier.gb] ?? tier.gb;
  const storageLabel = storageGb === -1 ? "Unlimited storage" : `${storageGb} GB storage`;
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://app.fotno.com";

  // Determine line item: use dynamic price for regional pricing, or fixed price ID
  const regionalCheckoutCents = regional?.tierCheckoutCents?.[tier.gb];
  let lineItems: any[];

  if (regionalCheckoutCents && tier.stripePriceId) {
    // Regional pricing: use price_data with the PPP-adjusted amount
    const existingPrice = await stripe.prices.retrieve(tier.stripePriceId);
    lineItems = [
      {
        price_data: {
          currency: "usd",
          unit_amount: regionalCheckoutCents,
          recurring: { interval: "month" as const },
          product: existingPrice.product as string,
        },
        quantity: 1,
      },
    ];
  } else {
    lineItems = [
      {
        price: tier.stripePriceId,
        quantity: 1,
      },
    ];
  }

  const sharedMetadata = {
    user_id: userId,
    tier_gb: String(tier.gb),
    ...(countryCode ? { country_code: countryCode } : {}),
  };

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: email,
    line_items: lineItems,
    metadata: sharedMetadata,
    subscription_data: {
      metadata: sharedMetadata,
    },
    success_url: `${dashboardUrl}/billing?checkout=success`,
    cancel_url: `${dashboardUrl}/billing`,
    allow_promotion_codes: !regionalCheckoutCents, // disable promo codes when using dynamic pricing
  });

  if (!session.url) {
    throw new AppError("Failed to create checkout session", 500);
  }

  return { checkoutUrl: session.url };
};
