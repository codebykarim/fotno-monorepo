import { Request, Response } from "express";
import AppError from "../errors/AppError";
import controllerReturn from "../utils/successReturn";
import { createCheckout } from "../services/SubscriptionServices/createCheckout";
import { fetchPlans } from "../services/SubscriptionServices/listPlans";
import { getActiveSubscription } from "../services/SubscriptionServices/getSubscription";
import { cancelSubscription } from "../services/SubscriptionServices/cancelSubscription";
import { changeTier } from "../services/SubscriptionServices/updateSubscription";
import { resolveUserAccess } from "../services/SubscriptionServices/resolveUserAccess";
import {
  verifyWebhookSignature,
  handleWebhookEvent,
} from "../services/SubscriptionServices/handleWebhook";
import { lsGetSubscription, lsGetCustomer } from "../services/SubscriptionServices/lemonSqueezy";
import { prisma } from "@workspace/db";
import { detectCountryFromIP } from "../utils/detectCountry";
import { withDetailedSpan, incrementMetric } from "../utils/datadog";

/**
 * Resolve country code from: explicit query/body param → CF header → IP geolocation.
 */
async function resolveCountry(req: Request, explicit?: string | null): Promise<string | null> {
  if (explicit) return explicit;
  const fromHeader =
    (req.headers["cf-ipcountry"] as string) ||
    (req.headers["x-vercel-ip-country"] as string) ||
    null;
  if (fromHeader) return fromHeader;
  return detectCountryFromIP(req.ip);
}

export const listPlansController = async (req: Request, res: Response) => {
  const country = await resolveCountry(req, (req.query.country as string) || null);
  const plans = await fetchPlans(country);
  return controllerReturn(plans, req, res);
};

export const getSubscriptionController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  const { access, subscription } = await withDetailedSpan(
    "subscription.get",
    { "usr.id": userId },
    async (span) => {
      const acc = await resolveUserAccess(userId);
      const sub = await getActiveSubscription(userId);
      span.setTag("subscription.status", acc.status);
      span.setTag("subscription.can_upload", acc.canUpload);
      span.setTag("subscription.can_create_gallery", acc.canCreateGallery);
      if (acc.trialDaysLeft !== undefined) {
        span.setTag("subscription.trial_days_left", acc.trialDaysLeft);
      }
      if (sub) {
        span.setTag("subscription.tier_gb", sub.storageTierGb);
        span.setTag("subscription.source", sub.source);
      }
      return { access: acc, subscription: sub };
    },
  );

  // Convert BigInt to string for JSON serialization
  const serializedAccess = {
    ...access,
    storageLimitBytes: access.storageLimitBytes.toString(),
  };

  return controllerReturn({ access: serializedAccess, subscription }, req, res);
};

export const createCheckoutController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  const { storageTierGb, countryCode } = req.body;
  if (!storageTierGb) throw new AppError("storageTierGb is required", 400);

  const result = await withDetailedSpan(
    "subscription.checkout",
    {
      "usr.id": userId,
      "checkout.tier_gb": storageTierGb,
      "checkout.country_code": countryCode,
    },
    async (span) => {
      const user = await (prisma as any).user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });

      if (!user) throw new AppError("User not found", 404);

      const resolvedCountry = await resolveCountry(req, countryCode);
      span.setTag("checkout.resolved_country", resolvedCountry ?? "unknown");

      const r = await createCheckout({
        userId,
        email: user.email,
        name: user.name || undefined,
        storageTierGb,
        countryCode: resolvedCountry || undefined,
      });
      span.setTag("checkout.has_url", !!(r as any)?.checkoutUrl);
      return r;
    },
  );

  incrementMetric("subscription.checkout.created", 1, [
    `tier:${storageTierGb}gb`,
    `user:${userId}`,
  ]);
  return controllerReturn(result, req, res);
};

export const cancelSubscriptionController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  await withDetailedSpan(
    "subscription.cancel",
    { "usr.id": userId },
    async (span) => {
      // Fetch current subscription info before cancellation for context
      const currentSub = await getActiveSubscription(userId);
      if (currentSub) {
        span.setTag("subscription.tier_gb", currentSub.storageTierGb);
        span.setTag("subscription.source", currentSub.source);
        span.setTag("subscription.status_before", currentSub.status);
      }
      await cancelSubscription(userId);
    },
  );

  incrementMetric("subscription.cancelled", 1, [`user:${userId}`]);
  return controllerReturn({ success: true }, req, res);
};

export const changeTierController = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  const { newStorageTierGb } = req.body;
  if (!newStorageTierGb)
    throw new AppError("newStorageTierGb is required", 400);

  await withDetailedSpan(
    "subscription.change_tier",
    {
      "usr.id": userId,
      "subscription.new_tier_gb": newStorageTierGb,
    },
    async (span) => {
      // Fetch current tier for upgrade/downgrade context
      const currentSub = await getActiveSubscription(userId);
      if (currentSub) {
        span.setTag("subscription.old_tier_gb", currentSub.storageTierGb);
        const isUpgrade = newStorageTierGb > currentSub.storageTierGb;
        span.setTag("subscription.direction", isUpgrade ? "upgrade" : "downgrade");
      }
      await changeTier({ userId, newStorageTierGb });
    },
  );

  incrementMetric("subscription.tier_changed", 1, [
    `new_tier:${newStorageTierGb}gb`,
    `user:${userId}`,
  ]);
  return controllerReturn({ success: true }, req, res);
};

export const webhookController = async (req: Request, res: Response) => {
  console.log("[Webhook] Received webhook request");

  const signature = req.headers["x-signature"] as string;

  if (!signature) {
    console.error("[Webhook] Missing x-signature header");
    incrementMetric("webhook.error", 1, ["reason:missing_signature"]);
    return res.status(401).json({ error: "Missing signature" });
  }

  const rawBody = (req as any).rawBody as Buffer;
  if (!rawBody) {
    console.error("[Webhook] Missing raw body - verify middleware is capturing it");
    incrementMetric("webhook.error", 1, ["reason:missing_body"]);
    return res.status(400).json({ error: "Missing raw body" });
  }

  if (!verifyWebhookSignature(rawBody, signature)) {
    console.error("[Webhook] Signature verification failed");
    incrementMetric("webhook.error", 1, ["reason:invalid_signature"]);
    return res.status(401).json({ error: "Invalid signature" });
  }

  try {
    const event = JSON.parse(rawBody.toString());
    const eventName = event?.meta?.event_name || "unknown";
    const lsSubscriptionId = event?.data?.id;
    const userId = event?.meta?.custom_data?.user_id;

    console.log(`[Webhook] Processing event: ${eventName}`);

    await withDetailedSpan(
      "subscription.webhook",
      {
        "webhook.event_name": eventName,
        "webhook.ls_subscription_id": lsSubscriptionId,
        "webhook.user_id": userId,
      },
      async (span) => {
        await handleWebhookEvent(event);
        span.setTag("webhook.processed", true);
      },
    );

    incrementMetric("webhook.processed", 1, [`event:${eventName}`]);
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error processing webhook event:", error);
    incrementMetric("webhook.processing_error", 1);
    // Still return 200 to prevent Lemon Squeezy from retrying,
    // but log the error for debugging
    return res.status(200).json({ received: true, error: "Processing failed - logged for review" });
  }
};

export const getPortalUrlController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  const result = await withDetailedSpan(
    "subscription.portal",
    { "usr.id": userId },
    async (span) => {
      // Try subscription portal URL first, fall back to customer portal
      const subscription = await getActiveSubscription(userId);
      if (subscription?.lsSubscriptionId) {
        span.setTag("portal.source", "subscription");
        const { data } = await lsGetSubscription(subscription.lsSubscriptionId);
        const portalUrl = (data?.data?.attributes as any)?.urls?.customer_portal;
        if (portalUrl) return { portalUrl };
      }

      // Fallback: get portal URL from customer record
      const user = await (prisma as any).user.findUnique({
        where: { id: userId },
        select: { lsCustomerId: true },
      });
      if (user?.lsCustomerId) {
        span.setTag("portal.source", "customer");
        const { data } = await lsGetCustomer(user.lsCustomerId);
        const portalUrl = (data?.data?.attributes as any)?.urls?.customer_portal;
        if (portalUrl) return { portalUrl };
      }

      span.setTag("portal.available", false);
      throw new AppError("Billing portal not available. Please contact support.", 404);
    },
  );

  incrementMetric("subscription.portal.accessed", 1, [`user:${userId}`]);
  return controllerReturn(result, req, res);
};
