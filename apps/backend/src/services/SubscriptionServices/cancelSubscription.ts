import { prisma } from "@workspace/db";
import { stripe } from "./stripe";
import { extractBillingPeriod } from "./handleWebhook";
import AppError from "../../errors/AppError";

export const cancelSubscription = async (userId: string): Promise<void> => {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
    orderBy: { createdAt: "desc" },
  });

  if (!subscription) {
    throw new AppError("No active subscription found", 404);
  }

  if (subscription.source === "STRIPE" && subscription.stripeSubscriptionId) {
    try {
      // Retrieve subscription first to extract billing period
      const stripeSub = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);

      // Cancel at period end — Stripe will fire customer.subscription.updated webhook
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      // Set endsAt now so the grace period check works immediately
      const period = await extractBillingPeriod(stripeSub);

      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
          endsAt: period.end,
          // Clear any pending tier change since subscription is being cancelled
          pendingTierGb: null,
          pendingEffectiveAt: null,
        },
      });

      console.log(
        `[cancelSubscription] Scheduled cancellation for userId=${userId}, ` +
        `access until ${period.end}`,
      );
    } catch (err: any) {
      if (err.statusCode !== 404) {
        throw new AppError(`Failed to cancel subscription: ${err.message}`, 500);
      }
      // Stripe sub not found — just mark as cancelled in DB
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
        },
      });
    }
  } else {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    });
  }
};
