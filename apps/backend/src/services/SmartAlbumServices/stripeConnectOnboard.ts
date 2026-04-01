import { db } from "./_shared";
import { stripe } from "../SubscriptionServices/stripe";

export const stripeConnectOnboard = async (userId: string) => {
  if (!stripe) {
    return { error: "Stripe not configured", status: 500 as const };
  }

  try {
    let config = await db.smartAlbumConfig.findUnique({ where: { userId } });

    if (!config) {
      config = await db.smartAlbumConfig.create({ data: { userId } });
    }

    let accountId = config.stripeConnectAccountId as string | null;

    // Create Connect Express account if not yet created
    if (!accountId) {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (!user) {
        return { error: "User not found", status: 404 as const };
      }

      const account = await stripe.accounts.create({
        type: "express",
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });

      accountId = account.id;

      await db.smartAlbumConfig.update({
        where: { userId },
        data: { stripeConnectAccountId: accountId },
      });
    }

    const dashboardUrl = process.env.DASHBOARD_URL || "https://app.fotno.com";

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${dashboardUrl}/smart-albums?connect=refresh`,
      return_url: `${dashboardUrl}/smart-albums?connect=return`,
      type: "account_onboarding",
    });

    return { data: { onboardingUrl: accountLink.url } };
  } catch (err: any) {
    return { error: err.message, status: 500 as const };
  }
};
