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
  "list-clients": {
    httpMethod: "GET",
    controllerFunction: AdminController.listClientsController,
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
  "user-payments": {
    httpMethod: "GET",
    controllerFunction: AdminController.getUserPaymentsController,
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
adminRoutes.get("/admin/users/:id/payments", handleMethod("user-payments"));
adminRoutes.get("/admin/galleries", handleMethod("list-galleries"));
adminRoutes.get("/admin/clients", handleMethod("list-clients"));
adminRoutes.get("/admin/storage", handleMethod("storage-overview"));
adminRoutes.get("/admin/payments", handleMethod("payments-overview"));
adminRoutes.get("/admin/services/health", handleMethod("service-health"));
adminRoutes.get("/admin/analytics", handleMethod("analytics"));

export default adminRoutes;
