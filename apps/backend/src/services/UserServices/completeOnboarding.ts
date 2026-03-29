import { prisma, Plan } from "@workspace/db";
import AppError from "../../errors/AppError";
import { stripe } from "../SubscriptionServices/stripe";

const GB_IN_BYTES = 1_073_741_824n; // 1 GB

export const completeOnboarding = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      finishOnboarding: true,
      stripeCustomerId: true,
      plan: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Determine plan from active Stripe subscription
  let plan: Plan = Plan.FREE;
  let storageLimit: bigint | undefined;
  let galleryLimit: number | null | undefined;
  let stripeSubscription: {
    id: string;
    tierGb: number;
    priceCents: number;
    priceId: string | null;
    currentPeriodStart: Date | null;
    currentPeriodEnd: Date | null;
  } | null = null;

  if (user.stripeCustomerId && stripe) {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: "active",
        limit: 1,
      });

      if (subscriptions.data.length > 0) {
        const sub = subscriptions.data[0];
        const tierGb = sub.metadata?.tier_gb;

        if (tierGb) {
          const gb = parseInt(tierGb, 10);
          const tier = await prisma.pricingTier.findUnique({
            where: { gb },
            select: {
              label: true,
              priceCents: true,
              stripePriceId: true,
              galleryLimit: true,
              gb: true,
            },
          });

          if (tier && tier.priceCents > 0) {
            plan = Plan.PRO;

            // Set storage: -1 means unlimited (use a very large number)
            if (tier.gb === -1) {
              storageLimit = BigInt(10) * BigInt(1024) * GB_IN_BYTES; // 10 TB
            } else {
              storageLimit = BigInt(tier.gb) * GB_IN_BYTES;
            }

            galleryLimit = tier.galleryLimit; // null = unlimited

            // Get subscription period info
            const periodStart = sub.current_period_start
              ? new Date(sub.current_period_start * 1000)
              : null;
            const periodEnd = sub.current_period_end
              ? new Date(sub.current_period_end * 1000)
              : null;

            stripeSubscription = {
              id: sub.id,
              tierGb: gb,
              priceCents: tier.priceCents,
              priceId: tier.stripePriceId,
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
            };
          }
        }
      }
    } catch (err) {
      console.warn(
        "[completeOnboarding] Failed to check Stripe subscription:",
        err,
      );
      // Continue with FREE plan — non-blocking
    }
  }

  // Update user plan + storage/gallery limits
  await prisma.user.update({
    where: { id: userId },
    data: {
      finishOnboarding: true,
      subscribed: true,
      plan,
      ...(storageLimit !== undefined ? { storageLimit } : {}),
      ...(galleryLimit !== undefined ? { galleryLimit } : {}),
    },
  });

  // Create Subscription record if a paid Stripe subscription exists
  if (stripeSubscription) {
    // Upsert to avoid duplicates if this runs twice
    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: stripeSubscription.id },
      update: {
        status: "ACTIVE",
        storageTierGb: stripeSubscription.tierGb,
        priceCents: stripeSubscription.priceCents,
        stripePriceId: stripeSubscription.priceId,
        currentPeriodStart: stripeSubscription.currentPeriodStart,
        currentPeriodEnd: stripeSubscription.currentPeriodEnd,
      },
      create: {
        userId,
        source: "STRIPE",
        status: "ACTIVE",
        storageTierGb: stripeSubscription.tierGb,
        priceCents: stripeSubscription.priceCents,
        stripePriceId: stripeSubscription.priceId,
        stripeSubscriptionId: stripeSubscription.id,
        currentPeriodStart: stripeSubscription.currentPeriodStart,
        currentPeriodEnd: stripeSubscription.currentPeriodEnd,
      },
    });
  }

  return { data: { finishOnboarding: true, plan }, status: 200 };
};
