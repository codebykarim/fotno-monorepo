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
  const data = req.body;

  console.log(data);

  res.sendStatus(200);
};
