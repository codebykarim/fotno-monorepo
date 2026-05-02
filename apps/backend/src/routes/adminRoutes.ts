import { NextFunction, Request, Response, Router } from "express";
import * as AdminController from "../controllers/AdminController";
import isAdmin from "../middleware/isAdmin";
import { MethodInfo } from "../interfaces";
import { init } from "../utils/methods";

const adminRoutes = Router();

const adminMethods: { [key: string]: MethodInfo } = {
  overview: {
    httpMethod: "GET",
    controllerFunction: AdminController.getOverviewController,
    authFunction: isAdmin,
  },
  "list-users": {
    httpMethod: "GET",
    controllerFunction: AdminController.listUsersController,
    authFunction: isAdmin,
  },
  "get-user": {
    httpMethod: "GET",
    controllerFunction: AdminController.getUserController,
    authFunction: isAdmin,
  },
  "ban-user": {
    httpMethod: "POST",
    controllerFunction: AdminController.banUserController,
    authFunction: isAdmin,
  },
  "unban-user": {
    httpMethod: "POST",
    controllerFunction: AdminController.unbanUserController,
    authFunction: isAdmin,
  },
  "set-role": {
    httpMethod: "POST",
    controllerFunction: AdminController.setRoleController,
    authFunction: isAdmin,
  },
  "impersonate-user": {
    httpMethod: "POST",
    controllerFunction: AdminController.impersonateUserController,
    authFunction: isAdmin,
  },
  "list-galleries": {
    httpMethod: "GET",
    controllerFunction: AdminController.listGalleriesController,
    authFunction: isAdmin,
  },
  "storage-overview": {
    httpMethod: "GET",
    controllerFunction: AdminController.getStorageOverviewController,
    authFunction: isAdmin,
  },
  "user-storage": {
    httpMethod: "GET",
    controllerFunction: AdminController.getUserStorageController,
    authFunction: isAdmin,
  },
  "user-subscriptions": {
    httpMethod: "GET",
    controllerFunction: AdminController.getUserSubscriptionsController,
    authFunction: isAdmin,
  },
  "service-health": {
    httpMethod: "GET",
    controllerFunction: AdminController.getServiceHealthController,
    authFunction: isAdmin,
  },
  analytics: {
    httpMethod: "GET",
    controllerFunction: AdminController.getAnalyticsController,
    authFunction: isAdmin,
  },
  "payments-overview": {
    httpMethod: "GET",
    controllerFunction: AdminController.getPaymentsOverviewController,
    authFunction: isAdmin,
  },
  "get-pricing": {
    httpMethod: "GET",
    controllerFunction: AdminController.getPricingConfigController,
    authFunction: isAdmin,
  },
  "create-pricing-tier": {
    httpMethod: "POST",
    controllerFunction: AdminController.createPricingTierController,
    authFunction: isAdmin,
  },
  "update-pricing-tier": {
    httpMethod: "PUT",
    controllerFunction: AdminController.updatePricingTierController,
    authFunction: isAdmin,
  },
  "delete-pricing-tier": {
    httpMethod: "DELETE",
    controllerFunction: AdminController.deletePricingTierController,
    authFunction: isAdmin,
  },
  "create-regional-pricing": {
    httpMethod: "POST",
    controllerFunction: AdminController.createRegionalPricingController,
    authFunction: isAdmin,
  },
  "update-regional-pricing": {
    httpMethod: "PUT",
    controllerFunction: AdminController.updateRegionalPricingController,
    authFunction: isAdmin,
  },
  "delete-regional-pricing": {
    httpMethod: "DELETE",
    controllerFunction: AdminController.deleteRegionalPricingController,
    authFunction: isAdmin,
  },
  "list-inbox": {
    httpMethod: "GET",
    controllerFunction: AdminController.listInboundEmailsController,
    authFunction: isAdmin,
  },
  "get-inbox-email": {
    httpMethod: "GET",
    controllerFunction: AdminController.getInboundEmailController,
    authFunction: isAdmin,
  },
  "update-inbox-email": {
    httpMethod: "PATCH",
    controllerFunction: AdminController.updateInboundEmailController,
    authFunction: isAdmin,
  },
  "delete-inbox-email": {
    httpMethod: "DELETE",
    controllerFunction: AdminController.deleteInboundEmailController,
    authFunction: isAdmin,
  },
  "send-user-email": {
    httpMethod: "POST",
    controllerFunction: AdminController.sendUserEmailController,
    authFunction: isAdmin,
  },
  "preview-user-email": {
    httpMethod: "POST",
    controllerFunction: AdminController.previewUserEmailController,
    authFunction: isAdmin,
  },
  "list-user-emails": {
    httpMethod: "GET",
    controllerFunction: AdminController.listUserEmailsController,
    authFunction: isAdmin,
  },
};

const mappedMethods = init(adminMethods);

const handleMethod =
  (method: string) => (req: Request, res: Response, next: NextFunction) => {
    req.params.method = method;
    return mappedMethods(req, res, next);
  };

adminRoutes.get("/admin/overview", handleMethod("overview"));
adminRoutes.get("/admin/users", handleMethod("list-users"));
adminRoutes.get("/admin/users/:id", handleMethod("get-user"));
adminRoutes.post("/admin/users/:id/ban", handleMethod("ban-user"));
adminRoutes.post("/admin/users/:id/unban", handleMethod("unban-user"));
adminRoutes.post("/admin/users/:id/role", handleMethod("set-role"));
adminRoutes.post("/admin/users/:id/impersonate", handleMethod("impersonate-user"));
adminRoutes.get("/admin/users/:id/storage", handleMethod("user-storage"));
adminRoutes.get("/admin/users/:id/subscriptions", handleMethod("user-subscriptions"));
adminRoutes.get("/admin/galleries", handleMethod("list-galleries"));
adminRoutes.get("/admin/storage", handleMethod("storage-overview"));
adminRoutes.get("/admin/payments", handleMethod("payments-overview"));
adminRoutes.get("/admin/services/health", handleMethod("service-health"));
adminRoutes.get("/admin/analytics", handleMethod("analytics"));

// Pricing management
adminRoutes.get("/admin/pricing", handleMethod("get-pricing"));
adminRoutes.post("/admin/pricing/tiers", handleMethod("create-pricing-tier"));
adminRoutes.put("/admin/pricing/tiers/:id", handleMethod("update-pricing-tier"));
adminRoutes.delete("/admin/pricing/tiers/:id", handleMethod("delete-pricing-tier"));
adminRoutes.post("/admin/pricing/regions", handleMethod("create-regional-pricing"));
adminRoutes.put("/admin/pricing/regions/:id", handleMethod("update-regional-pricing"));
adminRoutes.delete("/admin/pricing/regions/:id", handleMethod("delete-regional-pricing"));

// Inbox
adminRoutes.get("/admin/inbox", handleMethod("list-inbox"));
adminRoutes.get("/admin/inbox/:id", handleMethod("get-inbox-email"));
adminRoutes.patch("/admin/inbox/:id", handleMethod("update-inbox-email"));
adminRoutes.delete("/admin/inbox/:id", handleMethod("delete-inbox-email"));

// At-risk user re-engagement emails
adminRoutes.post("/admin/users/:id/email", handleMethod("send-user-email"));
adminRoutes.post(
  "/admin/users/:id/email/preview",
  handleMethod("preview-user-email"),
);
adminRoutes.get("/admin/users/:id/emails", handleMethod("list-user-emails"));

export default adminRoutes;
