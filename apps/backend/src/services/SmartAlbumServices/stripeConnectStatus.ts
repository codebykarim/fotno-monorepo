import { db } from "./_shared";
import { stripe } from "../SubscriptionServices/stripe";

export const stripeConnectStatus = async (userId: string) => {
  if (!stripe) {
    return { error: "Stripe not configured", status: 500 as const };
  }

  try {
    const config = await db.smartAlbumConfig.findUnique({
      where: { userId },
      select: { stripeConnectAccountId: true, stripeConnectOnboarded: true },
    });

    if (!config || !config.stripeConnectAccountId) {
      return {
        data: {
          connected: false,
          chargesEnabled: false,
          payoutsEnabled: false,
        },
      };
    }

    const account = await stripe.accounts.retrieve(config.stripeConnectAccountId as string);

    const chargesEnabled = account.charges_enabled ?? false;
    const payoutsEnabled = account.payouts_enabled ?? false;
    const fullyOnboarded = chargesEnabled && payoutsEnabled;

    // Persist onboarded status if it changed
    if (fullyOnboarded && !config.stripeConnectOnboarded) {
      await db.smartAlbumConfig.update({
        where: { userId },
        data: { stripeConnectOnboarded: true },
      });
    }

    return {
      data: {
        connected: true,
        chargesEnabled,
        payoutsEnabled,
      },
    };
  } catch (err: any) {
    return { error: err.message, status: 500 as const };
  }
};
