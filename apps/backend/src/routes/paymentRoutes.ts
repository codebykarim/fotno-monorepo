import { Router } from "express";
import { MethodInfo } from "../interfaces";
import * as PaymentController from "../controllers/PaymentController";
import { init } from "../utils/methods";
import isAuth from "../middleware/isAuth";

const paymentRouter = Router();

const paymentMethods: { [key: string]: MethodInfo } = {
  "list-subscription-plans": {
    httpMethod: "GET",
    controllerFunction: PaymentController.listSubscriptionPlansController,
    authFunction: isAuth,
  },
  "create-subscription": {
    httpMethod: "POST",
    controllerFunction: PaymentController.createSubscriptionController,
    authFunction: isAuth,
  },
  "get-subscription": {
    httpMethod: "GET",
    controllerFunction: PaymentController.getSubscriptionController,
    authFunction: isAuth,
  },
  "cancel-subscription": {
    httpMethod: "POST",
    controllerFunction: PaymentController.cancelSubscriptionController,
    authFunction: isAuth,
  },
  webhook: {
    httpMethod: "POST",
    controllerFunction: PaymentController.webhookController,
  },
};

const mapedMethods = init(paymentMethods);

// Map the route with method query
paymentRouter.route("/payment/:method").all(mapedMethods);

export default paymentRouter;
