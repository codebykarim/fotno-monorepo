import { Router } from "express";
import { MethodInfo } from "../interfaces";
import * as BillingController from "../controllers/BillingController";
import { init } from "../utils/methods";
import isAuth from "../middleware/isAuth";
import joi from "joi";

const billingRouter = Router();

const billingMethods: { [key: string]: MethodInfo } = {
  plans: {
    httpMethod: "GET",
    controllerFunction: BillingController.listPlansController,
  },
  subscription: {
    httpMethod: "GET",
    controllerFunction: BillingController.getSubscriptionController,
    authFunction: isAuth,
  },
  checkout: {
    httpMethod: "POST",
    controllerFunction: BillingController.createCheckoutController,
    authFunction: isAuth,
  },
  cancel: {
    httpMethod: "POST",
    controllerFunction: BillingController.cancelSubscriptionController,
    authFunction: isAuth,
  },
  "change-tier": {
    httpMethod: "PATCH",
    controllerFunction: BillingController.changeTierController,
    authFunction: isAuth,
  },
  portal: {
    httpMethod: "POST",
    controllerFunction: BillingController.getPortalUrlController,
    authFunction: isAuth,
  },
  webhook: {
    httpMethod: "POST",
    controllerFunction: BillingController.webhookController,
  },
  "create-subscription-intent": {
    httpMethod: "POST",
    controllerFunction: BillingController.createSubscriptionIntentController,
    authFunction: isAuth,
    bodyValidation: {
      tierLabel: joi.string().required(),
      countryCode: joi.string().optional().allow(null, ""),
    },
  },
  "create-setup-intent": {
    httpMethod: "POST",
    controllerFunction: BillingController.createSetupIntentController,
    authFunction: isAuth,
  },
  "set-default-payment-method": {
    httpMethod: "POST",
    controllerFunction: BillingController.setDefaultPaymentMethodController,
    authFunction: isAuth,
    bodyValidation: {
      paymentMethodId: joi.string().required(),
    },
  },
};

const mappedMethods = init(billingMethods);

billingRouter.route("/billing/:method").all(mappedMethods);

export default billingRouter;
