import { NextFunction, Request, Response, Router } from "express";
import * as SettingsController from "../controllers/SettingsController";
import isAuth from "../middleware/isAuth";
import { requireFeature } from "../middleware/requireFeature";
import { MethodInfo } from "../interfaces";
import { init } from "../utils/methods";

const settingsRoutes = Router();

const settingsMethods: { [key: string]: MethodInfo } = {
  profile: {
    httpMethod: "GET",
    controllerFunction: SettingsController.getProfileController,
    authFunction: isAuth,
  },
  "update-profile": {
    httpMethod: "PATCH",
    controllerFunction: SettingsController.updateProfileController,
    authFunction: isAuth,
  },
  notifications: {
    httpMethod: "GET",
    controllerFunction: SettingsController.getNotificationPreferencesController,
    authFunction: isAuth,
  },
  "update-notifications": {
    httpMethod: "PATCH",
    controllerFunction: SettingsController.updateNotificationPreferencesController,
    authFunction: isAuth,
  },
  "fcm-register": {
    httpMethod: "POST",
    controllerFunction: SettingsController.registerFcmTokenController,
    authFunction: isAuth,
  },
  "fcm-remove": {
    httpMethod: "POST",
    controllerFunction: SettingsController.removeFcmTokenController,
    authFunction: isAuth,
  },
  domain: {
    httpMethod: "GET",
    controllerFunction: SettingsController.getCustomDomainController,
    authFunction: isAuth,
  },
  "set-domain": {
    httpMethod: "POST",
    controllerFunction: SettingsController.setCustomDomainController,
    authFunction: isAuth,
    middlewares: [requireFeature("CUSTOM_DOMAINS")],
  },
  "verify-domain": {
    httpMethod: "POST",
    controllerFunction: SettingsController.verifyCustomDomainController,
    authFunction: isAuth,
    middlewares: [requireFeature("CUSTOM_DOMAINS")],
  },
  "remove-domain": {
    httpMethod: "DELETE",
    controllerFunction: SettingsController.removeCustomDomainController,
    authFunction: isAuth,
  },
  // ── Notification Inbox ──
  "list-notifications": {
    httpMethod: "GET",
    controllerFunction: SettingsController.listNotificationsController,
    authFunction: isAuth,
  },
  "unread-count": {
    httpMethod: "GET",
    controllerFunction: SettingsController.getUnreadCountController,
    authFunction: isAuth,
  },
  "mark-notification-read": {
    httpMethod: "POST",
    controllerFunction: SettingsController.markNotificationReadController,
    authFunction: isAuth,
  },
  "mark-all-read": {
    httpMethod: "POST",
    controllerFunction: SettingsController.markAllNotificationsReadController,
    authFunction: isAuth,
  },
  "archive-all-notifications": {
    httpMethod: "POST",
    controllerFunction: SettingsController.archiveAllNotificationsController,
    authFunction: isAuth,
  },
};

const mappedMethods = init(settingsMethods);

const handleMethod =
  (method: string) => (req: Request, res: Response, next: NextFunction) => {
    req.params.method = method;
    return mappedMethods(req, res, next);
  };

// Profile
settingsRoutes.get("/settings/profile", handleMethod("profile"));
settingsRoutes.patch("/settings/profile", handleMethod("update-profile"));

// Notifications
settingsRoutes.get("/settings/notifications", handleMethod("notifications"));
settingsRoutes.patch(
  "/settings/notifications",
  handleMethod("update-notifications"),
);
settingsRoutes.post("/settings/fcm/register", handleMethod("fcm-register"));
settingsRoutes.post("/settings/fcm/remove", handleMethod("fcm-remove"));

// Custom Domain
settingsRoutes.get("/settings/domain", handleMethod("domain"));
settingsRoutes.post("/settings/domain", handleMethod("set-domain"));
settingsRoutes.post("/settings/domain/verify", handleMethod("verify-domain"));
settingsRoutes.delete("/settings/domain", handleMethod("remove-domain"));

// Notification Inbox
settingsRoutes.get(
  "/settings/notifications/inbox",
  handleMethod("list-notifications"),
);
settingsRoutes.get(
  "/settings/notifications/unread-count",
  handleMethod("unread-count"),
);
settingsRoutes.post(
  "/settings/notifications/:notificationId/read",
  handleMethod("mark-notification-read"),
);
settingsRoutes.post(
  "/settings/notifications/mark-all-read",
  handleMethod("mark-all-read"),
);
settingsRoutes.post(
  "/settings/notifications/archive-all",
  handleMethod("archive-all-notifications"),
);

export default settingsRoutes;
