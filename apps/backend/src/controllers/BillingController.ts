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
import { withSpan, captureWithContext, addBreadcrumb } from "../utils/sentry";

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

  const { access, subscription } = await withSpan(
    "subscription.get",
    { userId },
    async () => {
      const acc = await resolveUserAccess(userId);
      const sub = await getActiveSubscription(userId);
      addBreadcrumb("subscription", "resolved user access", {
        status: acc.status,
        canUpload: acc.canUpload,
        trialDaysLeft: acc.trialDaysLeft,
      });
      return { access: acc, subscription: sub };
    },
  );

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

  const result = await withSpan(
    "subscription.checkout",
    { userId, tierGb: storageTierGb, countryCode },
    async () => {
      const user = await (prisma as any).user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });

      if (!user) throw new AppError("User not found", 404);

      const resolvedCountry = await resolveCountry(req, countryCode);
      addBreadcrumb("subscription", "creating checkout", {
        tierGb: storageTierGb,
        country: resolvedCountry ?? "unknown",
      });

      return createCheckout({
        userId,
        email: user.email,
        name: user.name || undefined,
        storageTierGb,
        countryCode: resolvedCountry || undefined,
      });
    },
  );

  return controllerReturn(result, req, res);
};

export const cancelSubscriptionController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  await withSpan("subscription.cancel", { userId }, async () => {
    addBreadcrumb("subscription", "cancelling subscription", { userId });
    await cancelSubscription(userId);
  });
  return controllerReturn({ success: true }, req, res);
};

export const changeTierController = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  const { newStorageTierGb } = req.body;
  if (!newStorageTierGb)
    throw new AppError("newStorageTierGb is required", 400);

  await withSpan("subscription.change_tier", { userId, newTierGb: newStorageTierGb }, async () => {
    addBreadcrumb("subscription", "changing tier", { userId, newTierGb: newStorageTierGb });
    await changeTier({ userId, newStorageTierGb });
  });
  return controllerReturn({ success: true }, req, res);
};

export const webhookController = async (req: Request, res: Response) => {
  console.log("[Webhook] Received webhook request");

  const signature = req.headers["x-signature"] as string;

  if (!signature) {
    console.error("[Webhook] Missing x-signature header");
    return res.status(401).json({ error: "Missing signature" });
  }

  const rawBody = (req as any).rawBody as Buffer;
  if (!rawBody) {
    console.error("[Webhook] Missing raw body - verify middleware is capturing it");
    return res.status(400).json({ error: "Missing raw body" });
  }

  if (!verifyWebhookSignature(rawBody, signature)) {
    console.error("[Webhook] Signature verification failed");
    return res.status(401).json({ error: "Invalid signature" });
  }

  try {
    const event = JSON.parse(rawBody.toString());
    const eventName = event?.meta?.event_name || "unknown";
    console.log(`[Webhook] Processing event: ${eventName}`);

    await withSpan(
      "subscription.webhook",
      { eventName, lsSubscriptionId: event?.data?.id, userId: event?.meta?.custom_data?.user_id },
      () => handleWebhookEvent(event),
    );
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error processing webhook event:", error);
    captureWithContext(error, {
      operation: "subscription.webhook",
      data: { rawBodyLength: rawBody.length },
    });
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

  // Try subscription portal URL first, fall back to customer portal
  const subscription = await getActiveSubscription(userId);
  if (subscription?.lsSubscriptionId) {
    const { data } = await lsGetSubscription(subscription.lsSubscriptionId);
    const portalUrl = (data?.data?.attributes as any)?.urls?.customer_portal;
    if (portalUrl) return controllerReturn({ portalUrl }, req, res);
  }

  // Fallback: get portal URL from customer record
  const user = await (prisma as any).user.findUnique({
    where: { id: userId },
    select: { lsCustomerId: true },
  });
  if (user?.lsCustomerId) {
    const { data } = await lsGetCustomer(user.lsCustomerId);
    const portalUrl = (data?.data?.attributes as any)?.urls?.customer_portal;
    if (portalUrl) return controllerReturn({ portalUrl }, req, res);
  }

  throw new AppError("Billing portal not available. Please contact support.", 404);
};
