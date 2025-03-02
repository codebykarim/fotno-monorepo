import { Router } from "express";
import { MethodInfo } from "../interfaces";
import * as PaymentController from "../controllers/PaymentController";
import { init } from "../utils/methods";
import isAuth from "../middleware/isAuth";

const paymentRouter = Router();

const paymentMethods: { [key: string]: MethodInfo } = {
  "list-subscription-plans": {
    httpMethod: "GET",
    controllerFunction: PaymentController.listSubscriptionPlans,
    authFunction: isAuth,
  },
};

const mapedMethods = init(paymentMethods);

// Map the route with method query
paymentRouter.route("/payment/:method").all(mapedMethods);

export default paymentRouter;
