import { Request, Response } from "express";
import AppError from "../errors/AppError";
import controllerReturn from "../utils/successReturn";
import { getSubscriptionsPlans } from "../services/PaymentServices/getSubscriptionsPlans";

export const listSubscriptionPlans = async (req: Request, res: Response) => {
  const plans = await getSubscriptionsPlans();

  return controllerReturn(plans, req, res);
};

export const createSubscription = async (req: Request, res: Response) => {};

// webhook handler for Paymob subscription events
