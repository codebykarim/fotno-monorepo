import { lsCreateCheckout } from "./lemonSqueezy";
import { findTierByGb } from "../../constants/plans";
import AppError from "../../errors/AppError";

export const createCheckout = async ({
  userId,
  email,
  name,
  storageTierGb,
}: {
  userId: string;
  email: string;
  name?: string;
  storageTierGb: number;
}): Promise<{ checkoutUrl: string }> => {
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  if (!storeId) {
    throw new AppError("Payment system not configured", 500);
  }

  const tier = findTierByGb(storageTierGb);
  if (!tier || !tier.lsVariantId) {
    throw new AppError("Invalid storage tier", 400);
  }

  const { data, error } = await lsCreateCheckout(storeId, tier.lsVariantId, {
    checkoutData: {
      email,
      ...(name ? { name } : {}),
      custom: {
        user_id: userId,
      },
    },
    productOptions: {
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
