import { stripe } from "./stripe";
import {
  fetchTiersFromDB,
  priceIdForInterval,
  type BillingInterval,
} from "../../constants/plans";
import { fetchRegionalPricingFromDB } from "../../constants/regional-pricing";
import AppError from "../../errors/AppError";
import { db } from "../DashboardServices/_shared";

export const createCheckout = async ({
  userId,
  email,
  name,
  storageTierGb,
  countryCode,
  interval = "monthly",
}: {
  userId: string;
  email: string;
  name?: string;
  storageTierGb: number;
  countryCode?: string;
  interval?: BillingInterval;
}): Promise<{ checkoutUrl: string }> => {
  if (storageTierGb === 0) {
    throw new AppError("Cannot create a checkout for the free tier", 400);
  }

  if (!stripe) {
    throw new AppError("Payment system not configured", 500);
  }

  // Apply PPP-adjusted price for regional users
  const regional = await fetchRegionalPricingFromDB(countryCode);

  // Look up tier from DB-backed tiers
  const dbTiers = await fetchTiersFromDB();
  const findDbTier = (gb: number) => dbTiers.find((t) => t.gb === gb);

  // Direct lookup first; if it fails, check if the gb value is a regional override
  let tier = findDbTier(storageTierGb);
  if (!tier && regional?.tierStorageOverrides) {
    const originalGb = Object.entries(regional.tierStorageOverrides)
      .find(([, overridden]) => overridden === storageTierGb)?.[0];
    if (originalGb) tier = findDbTier(Number(originalGb));
  }
  if (!tier) {
    throw new AppError("Invalid storage tier", 400);
  }

  const stripePriceId = priceIdForInterval(tier, interval);
  if (!stripePriceId) {
    throw new AppError(
      interval === "annual"
        ? "Annual billing is not yet configured for this plan."
        : "Invalid storage tier",
      400,
    );
  }

  const dashboardUrl =
    process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://app.fotno.com";

  // Regional PPP-adjusted prices are configured per-tier on monthly only.
  // Annual checkout always uses the configured annual Stripe price ID directly.
  const regionalCheckoutCents =
    interval === "monthly" ? regional?.tierCheckoutCents?.[tier.gb] : undefined;
  let lineItems: any[];

  if (regionalCheckoutCents) {
    // Retrieve the price to get the product ID; handle archived/missing prices gracefully
    let productId: string;
    try {
      const existingPrice = await stripe.prices.retrieve(stripePriceId);
      productId = existingPrice.product as string;
    } catch {
      throw new AppError(
        "Stripe price for this tier is no longer valid. Please contact support.",
        500,
      );
    }
    lineItems = [
      {
        price_data: {
          currency: "usd",
          unit_amount: regionalCheckoutCents,
          recurring: { interval: "month" as const },
          product: productId,
        },
        quantity: 1,
      },
    ];
  } else {
    lineItems = [
      {
        price: stripePriceId,
        quantity: 1,
      },
    ];
  }

  // Find or create Stripe customer (required for Accounts V2)
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  let customerId = user?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email,
      name: name || undefined,
      metadata: { user_id: userId },
    });
    customerId = customer.id;
    await db.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customerId },
    });
  }

  const sharedMetadata = {
    user_id: userId,
    tier_gb: String(tier.gb),
    interval,
    ...(countryCode ? { country_code: countryCode } : {}),
  };

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: lineItems,
    metadata: sharedMetadata,
    subscription_data: {
      metadata: sharedMetadata,
    },
    automatic_tax: { enabled: false },
    success_url: `${dashboardUrl}/billing?checkout=success`,
    cancel_url: `${dashboardUrl}/billing`,
    allow_promotion_codes: !regionalCheckoutCents,
  });

  if (!session.url) {
    throw new AppError("Failed to create checkout session", 500);
  }

  return { checkoutUrl: session.url };
};
