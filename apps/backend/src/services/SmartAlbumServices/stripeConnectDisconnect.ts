import { db } from "./_shared";
import { stripe } from "../SubscriptionServices/stripe";

export const stripeConnectDisconnect = async (userId: string) => {
  if (!stripe) {
    return { error: "Stripe not configured", status: 500 as const };
  }

  try {
    const config = await db.smartAlbumConfig.findUnique({
      where: { userId },
      select: {
        stripeConnectAccountId: true,
        paymentMethod: true,
      },
    });

    if (!config || !config.stripeConnectAccountId) {
      return { error: "No Stripe Connect account linked", status: 400 as const };
    }

    const accountId = config.stripeConnectAccountId as string;

    // Revoke platform access to the connected account (does NOT delete their Stripe account)
    try {
      await stripe.accounts.del(accountId);
    } catch (stripeErr: any) {
      // If account is already deleted/disconnected on Stripe side, that's fine
      if (stripeErr.code !== "account_invalid") {
        throw stripeErr;
      }
    }

    // Clear connect data from our DB and revert payment method to outside
    await db.smartAlbumConfig.update({
      where: { userId },
      data: {
        stripeConnectAccountId: null,
        stripeConnectOnboarded: false,
        paymentMethod: "OUTSIDE_FOTNO",
      },
    });

    return {
      data: { disconnected: true },
    };
  } catch (err: any) {
    return { error: err.message, status: 500 as const };
  }
};
