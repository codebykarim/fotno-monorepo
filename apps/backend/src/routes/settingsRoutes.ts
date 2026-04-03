import { NextFunction, Request, Response, Router } from "express";
import * as SettingsController from "../controllers/SettingsController";
import isAuth from "../middleware/isAuth";
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
  },
  "verify-domain": {
    httpMethod: "POST",
    controllerFunction: SettingsController.verifyCustomDomainController,
    authFunction: isAuth,
  },
  "remove-domain": {
    httpMethod: "DELETE",
    controllerFunction: SettingsController.removeCustomDomainController,
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

export default settingsRoutes;
