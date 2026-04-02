import { NextFunction, Request, Response, Router } from "express";
import * as SmartAlbumController from "../controllers/SmartAlbumController";
import isAuth from "../middleware/isAuth";
import isActiveSubscriber from "../middleware/isActiveSubscriber";
import { MethodInfo } from "../interfaces";
import { init } from "../utils/methods";

const smartAlbumRoutes = Router();

const smartAlbumMethods: { [key: string]: MethodInfo } = {
  // ─── Photographer Album Configuration (Dashboard) ──────────────────────────
  "get-config": {
    httpMethod: "GET",
    controllerFunction: SmartAlbumController.getConfigController,
    authFunction: isAuth,
  },
  "upsert-config": {
    httpMethod: "PATCH",
    controllerFunction: SmartAlbumController.upsertConfigController,
    authFunction: isAuth,
  },
  "create-product": {
    httpMethod: "POST",
    controllerFunction: SmartAlbumController.createProductController,
    authFunction: isAuth,
    middlewares: [isActiveSubscriber],
  },
  "update-product": {
    httpMethod: "PATCH",
    controllerFunction: SmartAlbumController.updateProductController,
    authFunction: isAuth,
  },
  "delete-product": {
    httpMethod: "DELETE",
    controllerFunction: SmartAlbumController.deleteProductController,
    authFunction: isAuth,
  },
  // ─── Product Images ────────────────────────────────────────────────────────
  "presign-product-image": {
    httpMethod: "POST",
    controllerFunction: SmartAlbumController.presignProductImageController,
    authFunction: isAuth,
  },
  "confirm-product-image": {
    httpMethod: "POST",
    controllerFunction: SmartAlbumController.confirmProductImageController,
    authFunction: isAuth,
  },
  "remove-product-image": {
    httpMethod: "DELETE",
    controllerFunction: SmartAlbumController.removeProductImageController,
    authFunction: isAuth,
  },
  // ─── Client Album Design (Public Gallery) ──────────────────────────────────
  "get-public-products": {
    httpMethod: "GET",
    controllerFunction: SmartAlbumController.getPublicProductsController,
  },
  "get-public-layouts": {
    httpMethod: "GET",
    controllerFunction: SmartAlbumController.getPublicLayoutsController,
  },
  "create-design": {
    httpMethod: "POST",
    controllerFunction: SmartAlbumController.createDesignController,
  },
  "list-designs": {
    httpMethod: "GET",
    controllerFunction: SmartAlbumController.listDesignsController,
  },
  "get-design": {
    httpMethod: "GET",
    controllerFunction: SmartAlbumController.getDesignController,
  },
  "update-design": {
    httpMethod: "PATCH",
    controllerFunction: SmartAlbumController.updateDesignController,
  },
  "submit-design": {
    httpMethod: "POST",
    controllerFunction: SmartAlbumController.submitDesignController,
  },
  "confirm-payment": {
    httpMethod: "POST",
    controllerFunction: SmartAlbumController.confirmPaymentController,
  },
  // ─── Photographer Review & Export (Dashboard) ──────────────────────────────
  "get-submissions": {
    httpMethod: "GET",
    controllerFunction: SmartAlbumController.getSubmissionsController,
    authFunction: isAuth,
  },
  "get-submission-detail": {
    httpMethod: "GET",
    controllerFunction: SmartAlbumController.getSubmissionDetailController,
    authFunction: isAuth,
  },
  "review-submission": {
    httpMethod: "POST",
    controllerFunction: SmartAlbumController.reviewSubmissionController,
    authFunction: isAuth,
  },
  "generate-export": {
    httpMethod: "POST",
    controllerFunction: SmartAlbumController.generateExportController,
    authFunction: isAuth,
  },
  // ─── Stripe Connect (Dashboard) ────────────────────────────────────────────
  "connect-onboard": {
    httpMethod: "POST",
    controllerFunction: SmartAlbumController.stripeConnectOnboardController,
    authFunction: isAuth,
  },
  "connect-status": {
    httpMethod: "GET",
    controllerFunction: SmartAlbumController.stripeConnectStatusController,
    authFunction: isAuth,
  },
  "connect-disconnect": {
    httpMethod: "POST",
    controllerFunction: SmartAlbumController.stripeConnectDisconnectController,
    authFunction: isAuth,
  },
};

const mappedMethods = init(smartAlbumMethods);

const handleMethod =
  (method: string) => (req: Request, res: Response, next: NextFunction) => {
    req.params.method = method;
    return mappedMethods(req, res, next);
  };

// ─── Photographer Album Configuration (Dashboard) ────────────────────────────

smartAlbumRoutes.get(
  "/dashboard/smart-album/config",
  handleMethod("get-config"),
);
smartAlbumRoutes.patch(
  "/dashboard/smart-album/config",
  handleMethod("upsert-config"),
);

smartAlbumRoutes.post(
  "/dashboard/smart-album/products",
  handleMethod("create-product"),
);
smartAlbumRoutes.patch(
  "/dashboard/smart-album/products/:productId",
  handleMethod("update-product"),
);
smartAlbumRoutes.delete(
  "/dashboard/smart-album/products/:productId",
  handleMethod("delete-product"),
);

// ─── Product Images ──────────────────────────────────────────────────────────

smartAlbumRoutes.post(
  "/dashboard/smart-album/products/:productId/images/presign",
  handleMethod("presign-product-image"),
);
smartAlbumRoutes.post(
  "/dashboard/smart-album/products/:productId/images",
  handleMethod("confirm-product-image"),
);
smartAlbumRoutes.delete(
  "/dashboard/smart-album/products/:productId/images",
  handleMethod("remove-product-image"),
);

// ─── Client Album Design (Public Gallery) ────────────────────────────────────

smartAlbumRoutes.get(
  "/public/gallery/:shareToken/smart-album/products",
  handleMethod("get-public-products"),
);
smartAlbumRoutes.get(
  "/public/gallery/:shareToken/smart-album/layouts",
  handleMethod("get-public-layouts"),
);
smartAlbumRoutes.post(
  "/public/gallery/:shareToken/smart-album/designs",
  handleMethod("create-design"),
);
smartAlbumRoutes.get(
  "/public/gallery/:shareToken/smart-album/designs",
  handleMethod("list-designs"),
);
smartAlbumRoutes.get(
  "/public/gallery/:shareToken/smart-album/designs/:designId",
  handleMethod("get-design"),
);
smartAlbumRoutes.patch(
  "/public/gallery/:shareToken/smart-album/designs/:designId",
  handleMethod("update-design"),
);
smartAlbumRoutes.post(
  "/public/gallery/:shareToken/smart-album/designs/:designId/submit",
  handleMethod("submit-design"),
);
smartAlbumRoutes.post(
  "/public/gallery/:shareToken/smart-album/designs/:designId/confirm-payment",
  handleMethod("confirm-payment"),
);

// ─── Photographer Review & Export (Dashboard) ────────────────────────────────

smartAlbumRoutes.get(
  "/dashboard/smart-album/submissions",
  handleMethod("get-submissions"),
);
smartAlbumRoutes.get(
  "/dashboard/smart-album/submissions/:submissionId",
  handleMethod("get-submission-detail"),
);
smartAlbumRoutes.post(
  "/dashboard/smart-album/submissions/:submissionId/review",
  handleMethod("review-submission"),
);
smartAlbumRoutes.post(
  "/dashboard/smart-album/submissions/:submissionId/export",
  handleMethod("generate-export"),
);

// ─── Stripe Connect (Dashboard) ─────────────────────────────────────────────

smartAlbumRoutes.post(
  "/dashboard/smart-album/connect/onboard",
  handleMethod("connect-onboard"),
);
smartAlbumRoutes.get(
  "/dashboard/smart-album/connect/status",
  handleMethod("connect-status"),
);
smartAlbumRoutes.post(
  "/dashboard/smart-album/connect/disconnect",
  handleMethod("connect-disconnect"),
);

export default smartAlbumRoutes;
