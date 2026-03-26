import { prisma } from "@workspace/db";
import { stripe, Stripe } from "./stripe";
import { findTierByPriceId, STORAGE_TIERS, getFreeTierLimits } from "../../constants/plans";
import { storageTierToBytes } from "../../constants/storage";
import { getRegionalPricing } from "../../constants/regional-pricing";

export const verifyWebhookSignature = (
  rawBody: Buffer,
  signature: string,
): Stripe.Event | null => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return null;
  }

  try {
    return stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err: any) {
    console.error("[Webhook] Signature verification failed:", err.message);
    return null;
  }
};

export const handleWebhookEvent = async (event: Stripe.Event): Promise<void> => {
  const eventType = event.type;

  console.log(`[Webhook] Event: ${eventType} | ID: ${event.id}`);

  try {
    switch (eventType) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log(`[Webhook] Unhandled event type: ${eventType}`);
    }
    console.log(`[Webhook] Successfully processed: ${eventType}`);
  } catch (error) {
    console.error(`[Webhook] FAILED to process: ${eventType}`, error);
    throw error;
  }
};

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  if (session.mode !== "subscription") return;

  const stripeSubscriptionId = session.subscription as string;
  const stripeCustomerId = session.customer as string;
  const userId = session.metadata?.user_id;
  const countryCode = session.metadata?.country_code;

  if (!stripeSubscriptionId) {
    console.error("[Webhook] checkout.session.completed: missing subscription ID");
    return;
  }

  // Idempotency: check if subscription already exists
  const existing = await (prisma as any).subscription.findUnique({
    where: { stripeSubscriptionId },
  });
  if (existing) {
    console.log(`[Webhook] checkout.session.completed skipped (idempotent): ${stripeSubscriptionId} already exists`);
    return;
  }

  // Fetch full subscription details from Stripe
  const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
  const item = sub.items.data[0];
  if (!item) {
    console.error("[Webhook] checkout.session.completed: subscription has no items");
    return;
  }

  const stripePriceId = item.price.id;
  const priceCents = item.price.unit_amount ?? 0;

  // Resolve user
  let user: any = null;
  let resolvedBy = "";

  if (userId) {
    user = await (prisma as any).user.findUnique({ where: { id: userId } });
    if (user) resolvedBy = `metadata.user_id=${userId}`;
  }

  if (!user && stripeCustomerId) {
    user = await (prisma as any).user.findUnique({ where: { stripeCustomerId } });
    if (user) resolvedBy = `stripeCustomerId=${stripeCustomerId}`;
  }

  if (!user && session.customer_email) {
    user = await (prisma as any).user.findFirst({ where: { email: session.customer_email } });
    if (user) resolvedBy = `email=${session.customer_email}`;
  }

  if (!user) {
    const msg = `[Webhook] checkout.session.completed FAILED: could not resolve user. user_id=${userId ?? "MISSING"}, stripeCustomerId=${stripeCustomerId}, email=${session.customer_email ?? "N/A"}`;
    console.error(msg);
    throw new Error(msg);
  }

  const resolvedUserId: string = user.id;
  console.log(`[Webhook] checkout.session.completed: user resolved via ${resolvedBy} -> userId=${resolvedUserId}`);

  const tier = findTierByPriceId(stripePriceId);
  if (!tier) {
    console.warn(`[Webhook] No tier found for priceId=${stripePriceId}. Configured prices: ${JSON.stringify(
      STORAGE_TIERS.map(t => ({ gb: t.gb, priceId: t.stripePriceId }))
    )}`);
  }
  const globalTierGb = tier?.gb ?? 50;
  const regional = getRegionalPricing(countryCode);
  const storageTierGb = regional?.tierStorageOverrides?.[globalTierGb] ?? globalTierGb;
  const storageLimit = storageTierToBytes(storageTierGb);

  const trialEnd = sub.trial_end ? new Date(sub.trial_end * 1000) : null;

  console.log(`[Webhook] Creating subscription: userId=${resolvedUserId}, tier=${storageTierGb}GB, price=${priceCents}cents`);

  try {
    await (prisma as any).$transaction([
      (prisma as any).subscription.create({
        data: {
          userId: resolvedUserId,
          source: "STRIPE",
          status: "ACTIVE",
          storageTierGb,
          priceCents,
          stripeSubscriptionId,
          stripePriceId,
          currentPeriodStart: new Date(sub.current_period_start * 1000),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
        },
      }),
      (prisma as any).user.update({
        where: { id: resolvedUserId },
        data: {
          plan: "PRO",
          subscribed: true,
          storageLimit,
          stripeCustomerId,
          galleryLimit: null,
          downgradedAt: null,
          ...(trialEnd ? { trialEndsAt: trialEnd } : {}),
        },
      }),
    ]);
    console.log(`[Webhook] Subscription created successfully for user ${resolvedUserId}: ${storageTierGb}GB plan`);
  } catch (txError: any) {
    const isUniqueConstraint =
      txError?.code === "P2002" ||
      txError?.message?.includes("Unique constraint failed");
    if (isUniqueConstraint) {
      console.warn(`[Webhook] checkout.session.completed: unique constraint hit (idempotent) for ${stripeSubscriptionId}`);
      return;
    }
    throw txError;
  }
}

/**
 * Find subscription by stripeSubscriptionId, with fallback to stripeCustomerId.
 */
async function findSubscriptionWithFallback(
  stripeSubscriptionId: string,
  stripeCustomerId: string | null,
  eventName: string,
): Promise<any | null> {
  let subscription = await (prisma as any).subscription.findUnique({
    where: { stripeSubscriptionId },
  });
  if (subscription) return subscription;

  if (stripeCustomerId) {
    const user = await (prisma as any).user.findUnique({ where: { stripeCustomerId } });
    if (user) {
      subscription = await (prisma as any).subscription.findFirst({
        where: { userId: user.id, source: "STRIPE" },
        orderBy: { createdAt: "desc" },
      });
      if (subscription) {
        console.warn(
          `[Webhook] ${eventName}: found via stripeCustomerId fallback -> subscriptionId=${subscription.id}`,
        );
        await (prisma as any).subscription.update({
          where: { id: subscription.id },
          data: { stripeSubscriptionId },
        });
        return subscription;
      }
    }
  }

  console.warn(`[Webhook] ${eventName}: subscription NOT FOUND. stripeSubscriptionId=${stripeSubscriptionId}`);
  return null;
}

async function handleSubscriptionUpdated(sub: Stripe.Subscription): Promise<void> {
  const stripeSubscriptionId = sub.id;
  const stripeCustomerId = sub.customer as string;
  const item = sub.items.data[0];
  if (!item) return;

  const stripePriceId = item.price.id;
  const subscription = await findSubscriptionWithFallback(stripeSubscriptionId, stripeCustomerId, "customer.subscription.updated");
  if (!subscription) return;

  const tier = findTierByPriceId(stripePriceId);
  if (!tier) {
    console.warn(`[Webhook] customer.subscription.updated: no tier for priceId=${stripePriceId}`);
    return;
  }

  const storageLimit = storageTierToBytes(tier.gb);
  const isCancelled = sub.cancel_at_period_end;
  const status = sub.status === "active"
    ? (isCancelled ? "CANCELLED" : "ACTIVE")
    : sub.status === "past_due"
      ? "PAST_DUE"
      : "ACTIVE";

  console.log(`[Webhook] customer.subscription.updated: userId=${subscription.userId}, newTier=${tier.gb}GB, status=${status}`);

  await (prisma as any).$transaction([
    (prisma as any).subscription.update({
      where: { id: subscription.id },
      data: {
        storageTierGb: tier.gb,
        priceCents: tier.priceCents,
        stripePriceId,
        stripeSubscriptionId,
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
        status,
        ...(isCancelled ? { cancelledAt: new Date(), endsAt: new Date(sub.current_period_end * 1000) } : { cancelledAt: null, endsAt: null }),
      },
    }),
    (prisma as any).user.update({
      where: { id: subscription.userId },
      data: { storageLimit },
    }),
  ]);
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription): Promise<void> {
  const stripeSubscriptionId = sub.id;
  const stripeCustomerId = sub.customer as string;

  const subscription = await findSubscriptionWithFallback(stripeSubscriptionId, stripeCustomerId, "customer.subscription.deleted");
  if (!subscription) return;

  const freeLimits = await getFreeTierLimits();
  console.log(`[Webhook] customer.subscription.deleted: userId=${subscription.userId}`);

  await (prisma as any).$transaction(async (tx: any) => {
    await tx.subscription.update({
      where: { id: subscription.id },
      data: { status: "EXPIRED", stripeSubscriptionId },
    });
    await tx.user.update({
      where: { id: subscription.userId },
      data: {
        plan: "FREE",
        subscribed: false,
        storageLimit: freeLimits.storageLimitBytes,
        galleryLimit: freeLimits.galleryLimit,
        downgradedAt: new Date(),
      },
    });
    // Auto-draft galleries beyond free tier limit
    const publishedGalleries = await tx.gallery.findMany({
      where: { userId: subscription.userId, isPublished: true },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    });
    if (publishedGalleries.length > freeLimits.galleryLimit) {
      const toDraft = publishedGalleries.slice(freeLimits.galleryLimit).map((g: any) => g.id);
      await tx.gallery.updateMany({
        where: { id: { in: toDraft } },
        data: { isPublished: false },
      });
      console.log(`[Webhook] customer.subscription.deleted: auto-drafted ${toDraft.length} galleries for userId=${subscription.userId}`);
    }
  });
  console.log(`[Webhook] customer.subscription.deleted: downgraded to FREE for userId=${subscription.userId}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  const stripeSubscriptionId = invoice.subscription as string;
  if (!stripeSubscriptionId) return; // one-time payment, skip

  const stripeCustomerId = invoice.customer as string;
  const subscription = await findSubscriptionWithFallback(stripeSubscriptionId, stripeCustomerId, "invoice.payment_succeeded");
  if (!subscription) return;

  console.log(`[Webhook] invoice.payment_succeeded: userId=${subscription.userId}`);

  // Fetch updated period from Stripe
  const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);

  await (prisma as any).$transaction([
    (prisma as any).subscription.update({
      where: { id: subscription.id },
      data: {
        status: "ACTIVE",
        stripeSubscriptionId,
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
      },
    }),
    (prisma as any).user.update({
      where: { id: subscription.userId },
      data: { plan: "PRO", subscribed: true, galleryLimit: null, downgradedAt: null },
    }),
  ]);
}

async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const stripeSubscriptionId = invoice.subscription as string;
  if (!stripeSubscriptionId) return;

  const stripeCustomerId = invoice.customer as string;
  console.log(`[Webhook] invoice.payment_failed: stripeSubscriptionId=${stripeSubscriptionId}`);

  const result = await (prisma as any).subscription.updateMany({
    where: { stripeSubscriptionId },
    data: { status: "PAST_DUE" },
  });

  if (result.count === 0 && stripeCustomerId) {
    const user = await (prisma as any).user.findUnique({ where: { stripeCustomerId } });
    if (user) {
      const fallbackResult = await (prisma as any).subscription.updateMany({
        where: { userId: user.id, source: "STRIPE" },
        data: { status: "PAST_DUE" },
      });
      if (fallbackResult.count > 0) {
        console.warn(`[Webhook] invoice.payment_failed: updated via stripeCustomerId fallback for userId=${user.id}`);
        return;
      }
    }
    console.warn(`[Webhook] invoice.payment_failed: no subscriptions found to update`);
  } else {
    console.log(`[Webhook] invoice.payment_failed: marked ${result.count} subscription(s) as PAST_DUE`);
  }
}
