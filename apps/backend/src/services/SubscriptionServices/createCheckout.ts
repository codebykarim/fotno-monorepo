import { lsCreateCheckout } from "./lemonSqueezy";
import { findTierByGb, PLAN_FEATURES } from "../../constants/plans";
import { getRegionalPricing } from "../../constants/regional-pricing";
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
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  if (!storeId) {
    throw new AppError("Payment system not configured", 500);
  }

  // Apply PPP-adjusted price for regional users
  const regional = getRegionalPricing(countryCode);

  // Direct lookup first; if it fails, check if the gb value is a regional override
  let tier = findTierByGb(storageTierGb);
  if (!tier && regional?.tierStorageOverrides) {
    const originalGb = Object.entries(regional.tierStorageOverrides)
      .find(([, overridden]) => overridden === storageTierGb)?.[0];
    if (originalGb) tier = findTierByGb(Number(originalGb));
  }
  if (!tier || !tier.lsVariantId) {
    throw new AppError("Invalid storage tier", 400);
  }
  const customPrice = regional
    ? Math.round(tier.priceCents * regional.pppMultiplier)
    : undefined;

  const storageGb = regional?.tierStorageOverrides?.[tier.gb] ?? tier.gb;
  const storageLabel = storageGb === -1 ? "Unlimited storage" : `${storageGb} GB storage`;

  const { data, error } = await lsCreateCheckout(storeId, tier.lsVariantId, {
    ...(customPrice ? { customPrice } : {}),
    checkoutData: {
      email,
      ...(name ? { name } : {}),
      custom: {
        user_id: userId,
        ...(countryCode ? { country_code: countryCode } : {}),
      },
    },
    checkoutOptions: {
      embed: true,
    },
    productOptions: {
      enabledVariants: [Number(tier.lsVariantId)],
      name: `Fotno Pro — ${storageLabel}`,
      redirectUrl: `${process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://app.fotno.com"}/billing?checkout=success`,
    },
  });

  if (error || !data) {
    throw new AppError(
      `Failed to create checkout: ${error?.message || "Unknown error"}`,
      500,
    );
  }

  const checkoutUrl = data.data.attributes.url;
  return { checkoutUrl };
};
