import { prisma } from "@workspace/db";
import AppError from "../../errors/AppError";

const DEFAULTS = {
  galleryExpiryBrowser: false,
  galleryExpiryEmail: false,
  storageWarningBrowser: false,
  storageWarningEmail: false,
  billingFailedBrowser: false,
  billingFailedEmail: false,
};

export const getNotificationPreferences = async (userId: string) => {
  const prefs = await (prisma as any).notificationPreference.findUnique({
    where: { userId },
  });

  if (!prefs) return { ...DEFAULTS };

  return {
    galleryExpiryBrowser: prefs.galleryExpiryBrowser,
    galleryExpiryEmail: prefs.galleryExpiryEmail,
    storageWarningBrowser: prefs.storageWarningBrowser,
    storageWarningEmail: prefs.storageWarningEmail,
    billingFailedBrowser: prefs.billingFailedBrowser,
    billingFailedEmail: prefs.billingFailedEmail,
  };
};

export const updateNotificationPreferences = async (
  userId: string,
  data: {
    galleryExpiryBrowser?: boolean;
    galleryExpiryEmail?: boolean;
    storageWarningBrowser?: boolean;
    storageWarningEmail?: boolean;
    billingFailedBrowser?: boolean;
    billingFailedEmail?: boolean;
  },
) => {
  const prefs = await (prisma as any).notificationPreference.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });

  return {
    galleryExpiryBrowser: prefs.galleryExpiryBrowser,
    galleryExpiryEmail: prefs.galleryExpiryEmail,
    storageWarningBrowser: prefs.storageWarningBrowser,
    storageWarningEmail: prefs.storageWarningEmail,
    billingFailedBrowser: prefs.billingFailedBrowser,
    billingFailedEmail: prefs.billingFailedEmail,
  };
};

export const registerFcmToken = async (
  userId: string,
  token: string,
  device?: string,
) => {
  if (!token) throw new AppError("FCM token is required", 400);

  await (prisma as any).fcmToken.upsert({
    where: {
      userId_token: { userId, token },
    },
    create: { userId, token, device },
    update: { device, updatedAt: new Date() },
  });

  return { registered: true };
};

export const removeFcmToken = async (userId: string, token: string) => {
  await (prisma as any).fcmToken.deleteMany({
    where: { userId, token },
  });

  return { removed: true };
};
