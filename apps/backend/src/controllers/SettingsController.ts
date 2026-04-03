import { Request, Response } from "express";
import AppError from "../errors/AppError";
import * as profileService from "../services/SettingsServices/profileService";
import * as notificationService from "../services/SettingsServices/notificationService";
import * as customDomainService from "../services/SettingsServices/customDomainService";

function getUserId(req: Request): string {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);
  return userId;
}

// ── Profile ──────────────────────────────────────────────────

export const getProfileController = async (req: Request, res: Response) => {
  const profile = await profileService.getProfile(getUserId(req));
  return res.status(200).json({ data: profile });
};

export const updateProfileController = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const updated = await profileService.updateProfile(getUserId(req), {
    name,
    email,
  });
  return res.status(200).json({ data: updated });
};

// ── Notifications ────────────────────────────────────────────

export const getNotificationPreferencesController = async (
  req: Request,
  res: Response,
) => {
  const prefs = await notificationService.getNotificationPreferences(
    getUserId(req),
  );
  return res.status(200).json({ data: prefs });
};

export const updateNotificationPreferencesController = async (
  req: Request,
  res: Response,
) => {
  const {
    galleryExpiryBrowser,
    galleryExpiryEmail,
    storageWarningBrowser,
    storageWarningEmail,
    billingFailedBrowser,
    billingFailedEmail,
  } = req.body;
  const prefs = await notificationService.updateNotificationPreferences(
    getUserId(req),
    {
      galleryExpiryBrowser,
      galleryExpiryEmail,
      storageWarningBrowser,
      storageWarningEmail,
      billingFailedBrowser,
      billingFailedEmail,
    },
  );
  return res.status(200).json({ data: prefs });
};

export const registerFcmTokenController = async (
  req: Request,
  res: Response,
) => {
  const { token, device } = req.body;
  const result = await notificationService.registerFcmToken(
    getUserId(req),
    token,
    device,
  );
  return res.status(200).json({ data: result });
};

export const removeFcmTokenController = async (
  req: Request,
  res: Response,
) => {
  const { token } = req.body;
  const result = await notificationService.removeFcmToken(
    getUserId(req),
    token,
  );
  return res.status(200).json({ data: result });
};

// ── Custom Domain ────────────────────────────────────────────

export const getCustomDomainController = async (
  req: Request,
  res: Response,
) => {
  const domain = await customDomainService.getCustomDomain(getUserId(req));
  return res.status(200).json({ data: domain });
};

export const setCustomDomainController = async (
  req: Request,
  res: Response,
) => {
  const { domain } = req.body;
  const result = await customDomainService.setCustomDomain(
    getUserId(req),
    domain,
  );
  return res.status(200).json({ data: result });
};

export const verifyCustomDomainController = async (
  req: Request,
  res: Response,
) => {
  const result = await customDomainService.verifyCustomDomain(getUserId(req));
  return res.status(200).json({ data: result });
};

export const removeCustomDomainController = async (
  req: Request,
  res: Response,
) => {
  const result = await customDomainService.removeCustomDomain(getUserId(req));
  return res.status(200).json({ data: result });
};
