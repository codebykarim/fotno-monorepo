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
import { stripe } from "../services/SubscriptionServices/stripe";
import { createSubscriptionIntent } from "../services/SubscriptionServices/createSubscriptionIntent";
import { createSetupIntent } from "../services/SubscriptionServices/createSetupIntent";
import { setDefaultPaymentMethod } from "../services/SubscriptionServices/setDefaultPaymentMethod";
import { prisma } from "@workspace/db";
import { detectCountryFromIP } from "../utils/detectCountry";
import { withSpan, captureWithContext, addBreadcrumb } from "../utils/sentry";
import { findTierByGbFromDB } from "../constants/plans";

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
      });
      return { access: acc, subscription: sub };
    },
  );

  const serializedAccess = {
    ...access,
    storageLimitBytes: access.storageLimitBytes.toString(),
  };

  // Include pending downgrade if set
  let serializedSubscription: any = subscription;
  if (subscription && subscription.pendingTierGb) {
    const pendingTier = await findTierByGbFromDB(subscription.pendingTierGb);
    serializedSubscription = {
      ...subscription,
      pendingDowngrade: pendingTier ? {
        tierGb: subscription.pendingTierGb,
        tierLabel: pendingTier.label,
        effectiveAt: subscription.pendingEffectiveAt?.toISOString() ?? null,
      } : null,
    };
  }

  return controllerReturn({ access: serializedAccess, subscription: serializedSubscription }, req, res);
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
      const user = await prisma.user.findUnique({
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

export const createSubscriptionIntentController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  const { tierLabel, countryCode: explicitCountry } = req.body;
  const countryCode = await resolveCountry(req, explicitCountry);

  const result = await withSpan(
    "subscription.create_intent",
    { userId, tierLabel, countryCode },
    async () => {
      addBreadcrumb("subscription", "creating subscription intent", { tierLabel, countryCode });
      return createSubscriptionIntent({ userId, tierLabel, countryCode });
    },
  );

  return res.status(result.status).json({ data: result.data });
};

export const createSetupIntentController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  const result = await withSpan(
    "subscription.create_setup_intent",
    { userId },
    async () => {
      addBreadcrumb("subscription", "creating setup intent", { userId });
      return createSetupIntent(userId);
    },
  );

  return res.status(result.status).json({ data: result.data });
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

  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    console.error("[Webhook] Missing stripe-signature header");
    return res.status(401).json({ error: "Missing signature" });
  }

  const rawBody = (req as any).rawBody as Buffer;
  if (!rawBody) {
    console.error("[Webhook] Missing raw body - verify middleware is capturing it");
    return res.status(400).json({ error: "Missing raw body" });
  }

  const event = verifyWebhookSignature(rawBody, signature);
  if (!event) {
    console.error("[Webhook] Signature verification failed");
    return res.status(401).json({ error: "Invalid signature" });
  }

  try {
    console.log(`[Webhook] Processing event: ${event.type}`);

    await withSpan(
      "subscription.webhook",
      { eventType: event.type, eventId: event.id },
      () => handleWebhookEvent(event),
    );
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error processing webhook event:", error);
    captureWithContext(error, {
      operation: "subscription.webhook",
      data: { eventType: event.type, eventId: event.id },
    });
    // Return 500 so Stripe retries the webhook
    return res.status(500).json({ error: "Processing failed" });
  }
};

export const getPortalUrlController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    throw new AppError("Billing portal not available. Please contact support.", 404);
  }

  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://app.fotno.com";

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${dashboardUrl}/billing`,
  });

  return controllerReturn({ portalUrl: portalSession.url }, req, res);
};

export const setDefaultPaymentMethodController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  const { paymentMethodId } = req.body;
  if (!paymentMethodId) throw new AppError("Missing paymentMethodId", 400);

  const result = await withSpan(
    "billing.set_default_payment_method",
    { userId },
    async () => {
      addBreadcrumb("billing", "setting default payment method", { userId });
      return setDefaultPaymentMethod({ userId, paymentMethodId });
    },
  );

  return res.status(result.status).json({ data: result.data });
};
