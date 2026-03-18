import { Request, Response } from "express";
import AppError from "../errors/AppError";
import controllerReturn from "../utils/successReturn";
import { STORAGE_TIERS } from "../constants/plans";
import { createCheckout } from "../services/SubscriptionServices/createCheckout";
import { getActiveSubscription } from "../services/SubscriptionServices/getSubscription";
import { cancelSubscription } from "../services/SubscriptionServices/cancelSubscription";
import { changeTier } from "../services/SubscriptionServices/updateSubscription";
import { resolveUserAccess } from "../services/SubscriptionServices/resolveUserAccess";
import {
  verifyWebhookSignature,
  handleWebhookEvent,
} from "../services/SubscriptionServices/handleWebhook";
import {
  createManualPlanRequest,
  getUserManualPlanRequest,
} from "../services/SubscriptionServices/manualPlan";
import { prisma } from "@workspace/db";

export const listPlansController = async (req: Request, res: Response) => {
  const plans = STORAGE_TIERS.map(({ lsVariantId, ...rest }) => rest);
  return controllerReturn(plans, req, res);
};

export const getSubscriptionController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  const access = await resolveUserAccess(userId);
  const subscription = await getActiveSubscription(userId);

  return controllerReturn({ access, subscription }, req, res);
};

export const createCheckoutController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  const { storageTierGb } = req.body;
  if (!storageTierGb) throw new AppError("storageTierGb is required", 400);

  const user = await (prisma as any).user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  const result = await createCheckout({
    userId,
    email: user.email,
    storageTierGb,
  });

  return controllerReturn(result, req, res);
};

export const cancelSubscriptionController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  await cancelSubscription(userId);
  return controllerReturn({ success: true }, req, res);
};

export const changeTierController = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  const { newStorageTierGb } = req.body;
  if (!newStorageTierGb)
    throw new AppError("newStorageTierGb is required", 400);

  await changeTier({ userId, newStorageTierGb });
  return controllerReturn({ success: true }, req, res);
};

export const webhookController = async (req: Request, res: Response) => {
  const signature = req.headers["x-signature"] as string;

  if (!signature) {
    return res.status(401).json({ error: "Missing signature" });
  }

  const rawBody = (req as any).rawBody as Buffer;
  if (!rawBody) {
    return res.status(400).json({ error: "Missing raw body" });
  }

  if (!verifyWebhookSignature(rawBody, signature)) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const event = JSON.parse(rawBody.toString());
  await handleWebhookEvent(event);

  return res.status(200).json({ received: true });
};

export const createManualRequestController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  const { storageTierGb } = req.body;
  if (!storageTierGb) throw new AppError("storageTierGb is required", 400);

  const request = await createManualPlanRequest({ userId, storageTierGb });
  return controllerReturn(request, req, res);
};

export const getManualRequestController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  const request = await getUserManualPlanRequest(userId);
  return controllerReturn(request, req, res);
};

export const getPortalUrlController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  const user = await (prisma as any).user.findUnique({
    where: { id: userId },
    select: { lsCustomerId: true },
  });

  if (!user?.lsCustomerId) {
    throw new AppError("No billing account found", 404);
  }

  // Lemon Squeezy customer portal URL
  const portalUrl = `https://app.lemonsqueezy.com/my-orders`;
  return controllerReturn({ portalUrl }, req, res);
};
