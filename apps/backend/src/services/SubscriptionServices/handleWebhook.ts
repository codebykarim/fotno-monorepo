import crypto from "crypto";
import { prisma } from "@workspace/db";
import { findTierByVariantId } from "../../constants/plans";
import { STORAGE_TIER_LIMITS, TRIAL_STORAGE_LIMIT } from "../../constants/storage";

type WebhookEvent = {
  meta: {
    event_name: string;
    custom_data?: {
      user_id?: string;
    };
  };
  data: {
    id: string;
    type: string;
    attributes: {
      store_id: number;
      customer_id: number;
      order_id: number;
      variant_id: number;
      product_id: number;
      status: string;
      renews_at: string | null;
      ends_at: string | null;
      created_at: string;
      updated_at: string;
      cancelled: boolean;
      first_subscription_item?: {
        price: number;
      };
    };
  };
};

export const verifyWebhookSignature = (
  rawBody: Buffer,
  signature: string,
): boolean => {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("LEMONSQUEEZY_WEBHOOK_SECRET not configured");
    return false;
  }

  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(digest, "hex"),
      Buffer.from(signature, "hex"),
    );
  } catch {
    return false;
  }
};

export const handleWebhookEvent = async (event: WebhookEvent): Promise<void> => {
  const eventName = event.meta.event_name;
  const attrs = event.data.attributes;
  const lsSubscriptionId = String(event.data.id);
  const variantId = String(attrs.variant_id);
  const userId = event.meta.custom_data?.user_id;

  switch (eventName) {
    case "subscription_created":
      await handleSubscriptionCreated(lsSubscriptionId, variantId, userId, attrs);
      break;
    case "subscription_updated":
      await handleSubscriptionUpdated(lsSubscriptionId, variantId, attrs);
      break;
    case "subscription_cancelled":
      await handleSubscriptionCancelled(lsSubscriptionId, attrs);
      break;
    case "subscription_expired":
      await handleSubscriptionExpired(lsSubscriptionId);
      break;
    case "subscription_payment_failed":
      await handlePaymentFailed(lsSubscriptionId);
      break;
    case "subscription_payment_success":
      await handlePaymentSuccess(lsSubscriptionId, attrs);
      break;
    case "subscription_resumed":
      await handleSubscriptionResumed(lsSubscriptionId, attrs);
      break;
    default:
      console.log(`Unhandled webhook event: ${eventName}`);
  }
};

async function handleSubscriptionCreated(
  lsSubscriptionId: string,
  variantId: string,
  userId: string | undefined,
  attrs: WebhookEvent["data"]["attributes"],
): Promise<void> {
  if (!userId) {
    console.error("subscription_created webhook missing user_id in custom_data");
    return;
  }

  // Idempotency: check if subscription already exists
  const existing = await (prisma as any).subscription.findUnique({
    where: { lsSubscriptionId },
  });
  if (existing) return;

  const tier = findTierByVariantId(variantId);
  const storageTierGb = tier?.gb ?? 50;
  const priceCents = tier?.priceCents ?? 500;
  const storageLimit = STORAGE_TIER_LIMITS[storageTierGb] ?? TRIAL_STORAGE_LIMIT;

  await (prisma as any).$transaction([
    (prisma as any).subscription.create({
      data: {
        userId,
        source: "LEMON_SQUEEZY",
        status: "ACTIVE",
        storageTierGb,
        priceCents,
        lsSubscriptionId,
        lsVariantId: variantId,
        currentPeriodStart: new Date(attrs.created_at),
        currentPeriodEnd: attrs.renews_at ? new Date(attrs.renews_at) : null,
      },
    }),
    (prisma as any).user.update({
      where: { id: userId },
      data: {
        plan: "PRO",
        subscribed: true,
        storageLimit,
        lsCustomerId: String(attrs.customer_id),
      },
    }),
  ]);
}

async function handleSubscriptionUpdated(
  lsSubscriptionId: string,
  variantId: string,
  attrs: WebhookEvent["data"]["attributes"],
): Promise<void> {
  const subscription = await (prisma as any).subscription.findUnique({
    where: { lsSubscriptionId },
  });
  if (!subscription) return;

  const tier = findTierByVariantId(variantId);
  if (!tier) return;

  const storageLimit = STORAGE_TIER_LIMITS[tier.gb] ?? TRIAL_STORAGE_LIMIT;

  await (prisma as any).$transaction([
    (prisma as any).subscription.update({
      where: { lsSubscriptionId },
      data: {
        storageTierGb: tier.gb,
        priceCents: tier.priceCents,
        lsVariantId: variantId,
        currentPeriodEnd: attrs.renews_at ? new Date(attrs.renews_at) : null,
        status: attrs.cancelled ? "CANCELLED" : "ACTIVE",
      },
    }),
    (prisma as any).user.update({
      where: { id: subscription.userId },
      data: { storageLimit },
    }),
  ]);
}

async function handleSubscriptionCancelled(
  lsSubscriptionId: string,
  attrs: WebhookEvent["data"]["attributes"],
): Promise<void> {
  const subscription = await (prisma as any).subscription.findUnique({
    where: { lsSubscriptionId },
  });
  if (!subscription) return;

  await (prisma as any).subscription.update({
    where: { lsSubscriptionId },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
      endsAt: attrs.ends_at ? new Date(attrs.ends_at) : null,
    },
  });
}

async function handleSubscriptionExpired(
  lsSubscriptionId: string,
): Promise<void> {
  const subscription = await (prisma as any).subscription.findUnique({
    where: { lsSubscriptionId },
  });
  if (!subscription) return;

  await (prisma as any).$transaction([
    (prisma as any).subscription.update({
      where: { lsSubscriptionId },
      data: { status: "EXPIRED" },
    }),
    (prisma as any).user.update({
      where: { id: subscription.userId },
      data: { plan: "EXPIRED", subscribed: false },
    }),
  ]);
}

async function handlePaymentFailed(
  lsSubscriptionId: string,
): Promise<void> {
  await (prisma as any).subscription.updateMany({
    where: { lsSubscriptionId },
    data: { status: "PAST_DUE" },
  });
}

async function handlePaymentSuccess(
  lsSubscriptionId: string,
  attrs: WebhookEvent["data"]["attributes"],
): Promise<void> {
  const subscription = await (prisma as any).subscription.findUnique({
    where: { lsSubscriptionId },
  });
  if (!subscription) return;

  await (prisma as any).$transaction([
    (prisma as any).subscription.update({
      where: { lsSubscriptionId },
      data: {
        status: "ACTIVE",
        currentPeriodEnd: attrs.renews_at ? new Date(attrs.renews_at) : null,
      },
    }),
    (prisma as any).user.update({
      where: { id: subscription.userId },
      data: { plan: "PRO", subscribed: true },
    }),
  ]);
}

async function handleSubscriptionResumed(
  lsSubscriptionId: string,
  attrs: WebhookEvent["data"]["attributes"],
): Promise<void> {
  const subscription = await (prisma as any).subscription.findUnique({
    where: { lsSubscriptionId },
  });
  if (!subscription) return;

  await (prisma as any).$transaction([
    (prisma as any).subscription.update({
      where: { lsSubscriptionId },
      data: {
        status: "ACTIVE",
        cancelledAt: null,
        endsAt: null,
        currentPeriodEnd: attrs.renews_at ? new Date(attrs.renews_at) : null,
      },
    }),
    (prisma as any).user.update({
      where: { id: subscription.userId },
      data: { plan: "PRO", subscribed: true },
    }),
  ]);
}
