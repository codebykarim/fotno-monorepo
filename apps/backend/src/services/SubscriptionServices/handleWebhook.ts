import crypto from "crypto";
import { prisma } from "@workspace/db";
import { findTierByVariantId, STORAGE_TIERS, getFreeTierLimits } from "../../constants/plans";
import { storageTierToBytes } from "../../constants/storage";
import { getRegionalPricing } from "../../constants/regional-pricing";

type WebhookEvent = {
  meta: {
    event_name: string;
    custom_data?: {
      user_id?: string;
      country_code?: string;
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
      user_email: string;
      user_name: string;
      renews_at: string | null;
      ends_at: string | null;
      created_at: string;
      updated_at: string;
      cancelled: boolean;
      trial_ends_at: string | null;
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
  const lsCustomerId = String(attrs.customer_id);
  const userId = event.meta.custom_data?.user_id;
  const countryCode = event.meta.custom_data?.country_code;

  console.log(`[Webhook] Event: ${eventName} | SubscriptionID: ${lsSubscriptionId} | VariantID: ${variantId} | CustomerID: ${lsCustomerId} | UserID: ${userId ?? "MISSING"} | Country: ${countryCode ?? "N/A"} | Status: ${attrs.status} | Email: ${attrs.user_email ?? "N/A"}`);

  try {
    switch (eventName) {
      case "subscription_created":
        await handleSubscriptionCreated(lsSubscriptionId, variantId, lsCustomerId, userId, attrs, countryCode);
        break;
      case "subscription_updated":
        await handleSubscriptionUpdated(lsSubscriptionId, variantId, lsCustomerId, attrs);
        break;
      case "subscription_cancelled":
        await handleSubscriptionCancelled(lsSubscriptionId, lsCustomerId, attrs);
        break;
      case "subscription_expired":
        await handleSubscriptionExpired(lsSubscriptionId, lsCustomerId);
        break;
      case "subscription_payment_failed":
        await handlePaymentFailed(lsSubscriptionId, lsCustomerId);
        break;
      case "subscription_payment_success":
        await handlePaymentSuccess(lsSubscriptionId, lsCustomerId, attrs);
        break;
      case "subscription_resumed":
        await handleSubscriptionResumed(lsSubscriptionId, lsCustomerId, attrs);
        break;
      default:
        console.log(`[Webhook] Unhandled event type: ${eventName}`);
    }
    console.log(`[Webhook] Successfully processed: ${eventName} for subscription ${lsSubscriptionId}`);
  } catch (error) {
    console.error(`[Webhook] FAILED to process: ${eventName} for subscription ${lsSubscriptionId}`, error);
    console.error(`[Webhook] Full event payload:`, JSON.stringify(event, null, 2));
    throw error;
  }
};

async function handleSubscriptionCreated(
  lsSubscriptionId: string,
  variantId: string,
  lsCustomerId: string,
  userId: string | undefined,
  attrs: WebhookEvent["data"]["attributes"],
  countryCode?: string,
): Promise<void> {
  // Idempotency: check if subscription already exists
  const existing = await (prisma as any).subscription.findUnique({
    where: { lsSubscriptionId },
  });
  if (existing) {
    console.log(`[Webhook] subscription_created skipped (idempotent): ${lsSubscriptionId} already exists for user ${existing.userId}`);
    return;
  }

  // Resolve user: try custom_data user_id first, then lsCustomerId, then email
  let user: any = null;
  let resolvedBy = "";

  if (userId) {
    user = await (prisma as any).user.findUnique({ where: { id: userId } });
    if (user) {
      resolvedBy = `custom_data.user_id=${userId}`;
    } else {
      console.warn(`[Webhook] subscription_created: user_id=${userId} from custom_data not found in DB, trying fallbacks`);
    }
  }

  if (!user && lsCustomerId) {
    user = await (prisma as any).user.findUnique({ where: { lsCustomerId } });
    if (user) {
      resolvedBy = `lsCustomerId=${lsCustomerId}`;
      console.log(`[Webhook] subscription_created: resolved user via lsCustomerId=${lsCustomerId} -> userId=${user.id}`);
    }
  }

  if (!user && attrs.user_email) {
    user = await (prisma as any).user.findFirst({ where: { email: attrs.user_email } });
    if (user) {
      resolvedBy = `email=${attrs.user_email}`;
      console.log(`[Webhook] subscription_created: resolved user via email=${attrs.user_email} -> userId=${user.id}`);
    }
  }

  if (!user) {
    const msg =
      `[Webhook] subscription_created FAILED: could not resolve user. ` +
      `user_id=${userId ?? "MISSING"}, lsCustomerId=${lsCustomerId}, email=${attrs.user_email ?? "N/A"}, ` +
      `lsSubscriptionId=${lsSubscriptionId}, variantId=${variantId}, status=${attrs.status}`;
    console.error(msg);
    console.error(`[Webhook] subscription_created full attrs:`, JSON.stringify(attrs));
    // Throw so Sentry captures it and LS retries the webhook
    throw new Error(msg);
  }

  const resolvedUserId: string = user.id;
  console.log(`[Webhook] subscription_created: user resolved via ${resolvedBy} -> userId=${resolvedUserId}`);

  const tier = findTierByVariantId(variantId);
  if (!tier) {
    console.warn(`[Webhook] No tier found for variantId=${variantId}. Configured variants: ${JSON.stringify(
      STORAGE_TIERS.map(t => ({ gb: t.gb, variantId: t.lsVariantId }))
    )}`);
  }
  const globalTierGb = tier?.gb ?? 50;
  // Apply regional storage override (e.g. Egypt Business: 500 GB → 250 GB)
  const regional = getRegionalPricing(countryCode);
  const storageTierGb = regional?.tierStorageOverrides?.[globalTierGb] ?? globalTierGb;
  // Use the actual price from the LS subscription (may be PPP-adjusted via customPrice)
  const priceCents = attrs.first_subscription_item?.price ?? tier?.priceCents ?? 500;
  const storageLimit = storageTierToBytes(storageTierGb);

  console.log(`[Webhook] Creating subscription: userId=${resolvedUserId}, tier=${storageTierGb}GB${countryCode ? ` (region: ${countryCode}, global: ${globalTierGb}GB)` : ""}, price=${priceCents}cents, storageLimit=${storageLimit}`);

  try {
    await (prisma as any).$transaction([
      (prisma as any).subscription.create({
        data: {
          userId: resolvedUserId,
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
        where: { id: resolvedUserId },
        data: {
          plan: "PRO",
          subscribed: true,
          storageLimit,
          lsCustomerId,
          galleryLimit: null,
          downgradedAt: null,
          ...(attrs.trial_ends_at ? { trialEndsAt: new Date(attrs.trial_ends_at) } : {}),
        },
      }),
    ]);
    console.log(`[Webhook] Subscription created successfully for user ${resolvedUserId}: ${storageTierGb}GB plan`);
  } catch (txError: any) {
    // Handle unique constraint violation (idempotent retry / race condition)
    const isUniqueConstraint =
      txError?.code === "P2002" ||
      txError?.message?.includes("Unique constraint failed");
    if (isUniqueConstraint) {
      console.warn(
        `[Webhook] subscription_created: unique constraint hit (idempotent) for lsSubscriptionId=${lsSubscriptionId}, userId=${resolvedUserId}. Treating as success.`,
      );
      return;
    }
    console.error(
      `[Webhook] subscription_created: transaction FAILED for userId=${resolvedUserId}, lsSubscriptionId=${lsSubscriptionId}`,
      txError,
    );
    console.error(`[Webhook] subscription_created full attrs:`, JSON.stringify(attrs));
    throw txError;
  }
}

/**
 * Attempt to find a subscription by lsSubscriptionId first, then fallback to
 * finding the most recent active subscription for the user identified by lsCustomerId.
 */
async function findSubscriptionWithFallback(
  lsSubscriptionId: string,
  lsCustomerId: string,
  eventName: string,
): Promise<any | null> {
  // Primary lookup by lsSubscriptionId
  let subscription = await (prisma as any).subscription.findUnique({
    where: { lsSubscriptionId },
  });
  if (subscription) return subscription;

  // Fallback: find user by lsCustomerId, then find their subscription
  if (lsCustomerId) {
    const user = await (prisma as any).user.findUnique({ where: { lsCustomerId } });
    if (user) {
      subscription = await (prisma as any).subscription.findFirst({
        where: { userId: user.id, source: "LEMON_SQUEEZY" },
        orderBy: { createdAt: "desc" },
      });
      if (subscription) {
        console.warn(
          `[Webhook] ${eventName}: subscription not found by lsSubscriptionId=${lsSubscriptionId}, ` +
          `but found via lsCustomerId=${lsCustomerId} -> subscriptionId=${subscription.id} (lsSub=${subscription.lsSubscriptionId}). ` +
          `Updating lsSubscriptionId to match.`,
        );
        // Fix the mismatch so future lookups work
        await (prisma as any).subscription.update({
          where: { id: subscription.id },
          data: { lsSubscriptionId },
        });
        return subscription;
      }
    }
  }

  console.warn(
    `[Webhook] ${eventName}: subscription NOT FOUND. lsSubscriptionId=${lsSubscriptionId}, lsCustomerId=${lsCustomerId}. ` +
    `No matching subscription exists for this user.`,
  );
  return null;
}

async function handleSubscriptionUpdated(
  lsSubscriptionId: string,
  variantId: string,
  lsCustomerId: string,
  attrs: WebhookEvent["data"]["attributes"],
): Promise<void> {
  const subscription = await findSubscriptionWithFallback(lsSubscriptionId, lsCustomerId, "subscription_updated");
  if (!subscription) return;

  const tier = findTierByVariantId(variantId);
  if (!tier) {
    console.warn(
      `[Webhook] subscription_updated: no tier for variantId=${variantId}, skipping. ` +
      `lsSubscriptionId=${lsSubscriptionId}, userId=${subscription.userId}`,
    );
    return;
  }

  const storageLimit = storageTierToBytes(tier.gb);

  console.log(
    `[Webhook] subscription_updated: userId=${subscription.userId}, newTier=${tier.gb}GB, ` +
    `status=${attrs.cancelled ? "CANCELLED" : "ACTIVE"}, renewsAt=${attrs.renews_at ?? "N/A"}`,
  );

  await (prisma as any).$transaction([
    (prisma as any).subscription.update({
      where: { id: subscription.id },
      data: {
        storageTierGb: tier.gb,
        priceCents: tier.priceCents,
        lsVariantId: variantId,
        lsSubscriptionId,
        ...(attrs.renews_at ? { currentPeriodEnd: new Date(attrs.renews_at) } : {}),
        status: attrs.cancelled ? "CANCELLED" : "ACTIVE",
      },
    }),
    (prisma as any).user.update({
      where: { id: subscription.userId },
      data: { storageLimit },
    }),
  ]);
  console.log(`[Webhook] subscription_updated: completed for userId=${subscription.userId}`);
}

async function handleSubscriptionCancelled(
  lsSubscriptionId: string,
  lsCustomerId: string,
  attrs: WebhookEvent["data"]["attributes"],
): Promise<void> {
  const subscription = await findSubscriptionWithFallback(lsSubscriptionId, lsCustomerId, "subscription_cancelled");
  if (!subscription) return;

  console.log(
    `[Webhook] subscription_cancelled: userId=${subscription.userId}, endsAt=${attrs.ends_at ?? "N/A"}`,
  );

  await (prisma as any).subscription.update({
    where: { id: subscription.id },
    data: {
      status: "CANCELLED",
      lsSubscriptionId,
      cancelledAt: new Date(),
      endsAt: attrs.ends_at ? new Date(attrs.ends_at) : null,
    },
  });
  console.log(`[Webhook] subscription_cancelled: completed for userId=${subscription.userId}`);
}

async function handleSubscriptionExpired(
  lsSubscriptionId: string,
  lsCustomerId: string,
): Promise<void> {
  const subscription = await findSubscriptionWithFallback(lsSubscriptionId, lsCustomerId, "subscription_expired");
  if (!subscription) return;

  const freeLimits = await getFreeTierLimits();
  console.log(`[Webhook] subscription_expired: userId=${subscription.userId}`);

  await (prisma as any).$transaction(async (tx: any) => {
    await tx.subscription.update({
      where: { id: subscription.id },
      data: { status: "EXPIRED", lsSubscriptionId },
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
    // Auto-draft galleries beyond the free tier gallery limit
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
      console.log(`[Webhook] subscription_expired: auto-drafted ${toDraft.length} galleries for userId=${subscription.userId}`);
    }
  });
  console.log(`[Webhook] subscription_expired: downgraded to FREE for userId=${subscription.userId}`);
}

async function handlePaymentFailed(
  lsSubscriptionId: string,
  lsCustomerId: string,
): Promise<void> {
  console.log(`[Webhook] subscription_payment_failed: lsSubscriptionId=${lsSubscriptionId}, lsCustomerId=${lsCustomerId}`);

  const result = await (prisma as any).subscription.updateMany({
    where: { lsSubscriptionId },
    data: { status: "PAST_DUE" },
  });

  if (result.count === 0) {
    // Try fallback by customer ID
    if (lsCustomerId) {
      const user = await (prisma as any).user.findUnique({ where: { lsCustomerId } });
      if (user) {
        const fallbackResult = await (prisma as any).subscription.updateMany({
          where: { userId: user.id, source: "LEMON_SQUEEZY" },
          data: { status: "PAST_DUE" },
        });
        if (fallbackResult.count > 0) {
          console.warn(
            `[Webhook] subscription_payment_failed: updated ${fallbackResult.count} subscription(s) via lsCustomerId fallback for userId=${user.id}`,
          );
          return;
        }
      }
    }
    console.warn(
      `[Webhook] subscription_payment_failed: no subscriptions found to update. lsSubscriptionId=${lsSubscriptionId}, lsCustomerId=${lsCustomerId}`,
    );
  } else {
    console.log(`[Webhook] subscription_payment_failed: marked ${result.count} subscription(s) as PAST_DUE`);
  }
}

async function handlePaymentSuccess(
  lsSubscriptionId: string,
  lsCustomerId: string,
  attrs: WebhookEvent["data"]["attributes"],
): Promise<void> {
  const subscription = await findSubscriptionWithFallback(lsSubscriptionId, lsCustomerId, "subscription_payment_success");
  if (!subscription) return;

  console.log(
    `[Webhook] subscription_payment_success: userId=${subscription.userId}, renewsAt=${attrs.renews_at ?? "N/A"}`,
  );

  await (prisma as any).$transaction([
    (prisma as any).subscription.update({
      where: { id: subscription.id },
      data: {
        status: "ACTIVE",
        lsSubscriptionId,
        ...(attrs.renews_at ? { currentPeriodEnd: new Date(attrs.renews_at) } : {}),
      },
    }),
    (prisma as any).user.update({
      where: { id: subscription.userId },
      data: { plan: "PRO", subscribed: true, galleryLimit: null, downgradedAt: null },
    }),
  ]);
  console.log(`[Webhook] subscription_payment_success: completed for userId=${subscription.userId}`);
}

async function handleSubscriptionResumed(
  lsSubscriptionId: string,
  lsCustomerId: string,
  attrs: WebhookEvent["data"]["attributes"],
): Promise<void> {
  const subscription = await findSubscriptionWithFallback(lsSubscriptionId, lsCustomerId, "subscription_resumed");
  if (!subscription) return;

  console.log(
    `[Webhook] subscription_resumed: userId=${subscription.userId}, renewsAt=${attrs.renews_at ?? "N/A"}`,
  );

  await (prisma as any).$transaction([
    (prisma as any).subscription.update({
      where: { id: subscription.id },
      data: {
        status: "ACTIVE",
        lsSubscriptionId,
        cancelledAt: null,
        endsAt: null,
        ...(attrs.renews_at ? { currentPeriodEnd: new Date(attrs.renews_at) } : {}),
      },
    }),
    (prisma as any).user.update({
      where: { id: subscription.userId },
      data: { plan: "PRO", subscribed: true, galleryLimit: null, downgradedAt: null },
    }),
  ]);
  console.log(`[Webhook] subscription_resumed: completed for userId=${subscription.userId}`);
}
