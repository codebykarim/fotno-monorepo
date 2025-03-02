import { Request, Response } from "express";
import AppError from "../errors/AppError";
import controllerReturn from "../utils/successReturn";
import { getSubscriptionsPlans } from "../services/PaymentServices/getSubscriptionsPlans";
import {
  createSubscription as createSubscriptionService,
  generateCheckoutUrl,
} from "../services/PaymentServices/createSubscription";
import type {
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
} from "../services/PaymentServices/createSubscription";
import AddUserOnboardingService from "../services/UserServices/addUserOnboarding";
import prisma from "../prisma";

export const listSubscriptionPlans = async (req: Request, res: Response) => {
  const plans = await getSubscriptionsPlans();

  return controllerReturn(plans, req, res);
};

export const createSubscriptionController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      userType,
      companyName,
      companySize,
      photographyType,
      photographyLevel,
      contactMethod,
      planName,
      billing_data,
    } = req.body;

    // Add other fields to userOnboarding
    await AddUserOnboardingService({
      userType,
      companyName,
      companySize,
      photographyType,
      photographyLevel,
      contactMethod,
      userId: req.user.id,
    });

    // Create the subscription
    const subscription: CreateSubscriptionResponse =
      await createSubscriptionService({
        planName,
        billing_data,
      });

    // Generate checkout URL if needed
    const checkoutUrl = generateCheckoutUrl(
      process.env.PAYMOB_PUBLIC_KEY as string,
      subscription.client_secret
    );

    return controllerReturn({ ...subscription, checkoutUrl }, req, res);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      (error as Error).message || "Failed to create subscription"
    );
  }
};

// webhook handler for Paymob subscription events
export const webhookHandler = async (req: Request, res: Response) => {
  const signature = req.headers["x-paymob-signature"];
  const timestamp = req.headers["x-paymob-timestamp"];
  const event = req.headers["x-paymob-event"];
  const data = req.body;

  if (!signature || !timestamp || !event) {
    throw new AppError("Missing required headers");
  }

  const hmac = crypto.createHmac("sha256", process.env.PAYMOB_SECRET_KEY);
  hmac.update(JSON.stringify(data));
  const calculatedSignature = hmac.digest("hex");

  if (calculatedSignature !== signature) {
    throw new AppError("Invalid signature");
  }

  if (event === "subscription.created") {
    const subscriptionId = data.subscription.id;
    const subscription = await prisma.payment.findFirst({
      where: {
        subscriptionId: subscriptionId,
      },
    });

    if (!subscription) {
      throw new AppError("Subscription not found");
    }

    // Update the subscription status
    await prisma.payment.update({
      where: {
        subscriptionId: subscriptionId,
      },
      data: {
        status: "ACTIVE",
      },
    });
  }

  res.sendStatus(200);
};
