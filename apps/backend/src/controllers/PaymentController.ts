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
import CreateSuccessSubscription from "../services/PaymentServices/createSuccessSubscription";
import { auth } from "../auth";
import { fromNodeHeaders } from "better-auth/node";
import { getUserSubscription } from "../services/PaymentServices/getUserSubscription";
import { cancelSubscription } from "../services/PaymentServices/cancelSubscription";

export const listSubscriptionPlansController = async (
  req: Request,
  res: Response
) => {
  const plans = await getSubscriptionsPlans();

  return controllerReturn(plans, req, res);
};

export const createSubscriptionController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

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
        user: session?.user,
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

export const getSubscriptionController = async (
  req: Request,
  res: Response
) => {
  const subscription = await getUserSubscription(req.user.id);

  controllerReturn(subscription, req, res);
};

export const cancelSubscriptionController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const subscription = await cancelSubscription(req.user.id);

  return controllerReturn(subscription, req, res);
};

// webhook handler for Paymob subscription events
export const webhookController = async (req: Request, res: Response) => {
  const data = req.body;
  console.log(data);

  if (data.trigger_type === "Failed Transaction") {
    return res.json(data).status(200);
  }

  if (data.trigger_type === "Subscription Created") {
    await CreateSuccessSubscription({
      email: data.subscription_data.client_info.email,
      subscriptionId: data.subscription_data.id,
      planId: data.subscription_data.plan_id,
      planExpiresAt: new Date(data.subscription_data.next_billing),
      planStartedAt: new Date(data.subscription_data.starts_at),
      plan: data.subscription_data.name,
      amount_cents: data.subscription_data.amount_cents,
      transactionId: data.transaction_id,
      initial_transaction: data.subscription_data.initial_transaction,
    });

    return res.json(data).status(200);
  }

  return res.json(data).status(200);
};
