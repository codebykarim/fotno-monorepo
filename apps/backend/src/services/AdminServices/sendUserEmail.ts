import {
  ADMIN_PRESETS,
  AdminMessageParams,
  AdminPresetId,
  renderAdminMessageEmail,
} from "../../emails/admin-message";
import { wrapEmailLayout } from "../../emails/layout";
import { sendMail } from "../../utils/sendMail";
import { db } from "./_shared";

type Input = {
  preset: AdminPresetId;
  promoCode?: string;
  featureName?: string;
};

const buildParams = (
  input: Input,
  userName: string
): AdminMessageParams => ({
  preset: input.preset,
  userName,
  promoCode: input.promoCode,
  featureName: input.featureName,
});

export const sendUserEmail = async (
  userId: string,
  input: Input,
  sentByUserId?: string
) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });
  if (!user?.email) {
    throw new Error("User has no email address");
  }
  const params = buildParams(input, user.name ?? "");
  const { subject, html } = renderAdminMessageEmail(params);
  await sendMail({
    to: user.email,
    subject,
    text: html,
    preheaderText: subject,
  });
  await db.adminMessageLog.create({
    data: {
      userId,
      sentByUserId: sentByUserId ?? null,
      preset: input.preset,
      subject,
      promoCode: input.promoCode ?? null,
      featureName: input.featureName ?? null,
    },
  });
  return { success: true };
};

export const previewUserEmail = async (userId: string, input: Input) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });
  const params = buildParams(input, user?.name ?? "");
  const { subject, html } = renderAdminMessageEmail(params);
  return {
    subject,
    html: wrapEmailLayout(html, { preheaderText: subject }),
  };
};

export const listUserEmails = async (userId: string) => {
  const rows = await db.adminMessageLog.findMany({
    where: { userId },
    orderBy: { sentAt: "desc" },
    take: 25,
    select: {
      id: true,
      preset: true,
      subject: true,
      promoCode: true,
      featureName: true,
      sentAt: true,
      sentByUser: { select: { id: true, name: true, email: true } },
    },
  });
  return rows.map((r) => ({
    id: r.id,
    preset: r.preset,
    subject: r.subject,
    promoCode: r.promoCode,
    featureName: r.featureName,
    sentAt: r.sentAt.toISOString(),
    sentBy: r.sentByUser
      ? { id: r.sentByUser.id, name: r.sentByUser.name, email: r.sentByUser.email }
      : null,
  }));
};

export { ADMIN_PRESETS };
