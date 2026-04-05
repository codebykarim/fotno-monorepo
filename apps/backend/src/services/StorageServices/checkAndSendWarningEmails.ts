import {
  WARNING_THRESHOLD_80,
  WARNING_THRESHOLD_95,
} from "../../constants/storage";
import {
  renderStorageWarning80Email,
  STORAGE_WARNING_80_SUBJECT,
} from "../../emails/storage-warning-80";
import {
  renderStorageWarning95Email,
  STORAGE_WARNING_95_SUBJECT,
} from "../../emails/storage-warning-95";
import { wrapEmailLayout } from "../../emails/layout";
import {
  fetchUserStorage,
  prisma,
  plunk,
  resolvePlanLimit,
  safeBigInt,
} from "./_shared";

export const checkAndSendWarningEmails = async (userId: string): Promise<void> => {
  const user = await fetchUserStorage(userId);
  const storageUsed = safeBigInt(user.storageUsed);
  const rawLimit = safeBigInt(user.storageLimit);
  const storageLimit = rawLimit > 0n ? rawLimit : resolvePlanLimit(user.plan);

  if (storageLimit <= 0n || !plunk || !user.email) {
    return;
  }

  const percentage = Number((storageUsed * 100n) / storageLimit);
  const upgradeUrl = `${process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "https://dashboard.fotno.com"}/billing`;

  if (percentage >= WARNING_THRESHOLD_95 * 100 && !user.warningEmailSent95) {
    const html = wrapEmailLayout(
      renderStorageWarning95Email({
        name: user.name,
        used: storageUsed,
        limit: storageLimit,
        percentage,
        upgradeUrl,
      }),
      { preheaderText: "You are nearly out of storage space" },
    );

    await plunk.emails.send({
      to: user.email,
      subject: STORAGE_WARNING_95_SUBJECT,
      body: html,
    });

    await (prisma as any).user.update({
      where: { id: userId },
      data: { warningEmailSent95: true },
    });

    return;
  }

  if (percentage >= WARNING_THRESHOLD_80 * 100 && !user.warningEmailSent80) {
    const html = wrapEmailLayout(
      renderStorageWarning80Email({
        name: user.name,
        used: storageUsed,
        limit: storageLimit,
        percentage,
        upgradeUrl,
      }),
      { preheaderText: "You have used most of your storage" },
    );

    await plunk.emails.send({
      to: user.email,
      subject: STORAGE_WARNING_80_SUBJECT,
      body: html,
    });

    await (prisma as any).user.update({
      where: { id: userId },
      data: { warningEmailSent80: true },
    });
  }
};
