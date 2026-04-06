import { Resend } from "resend";
import { wrapEmailLayout } from "../emails/layout";

const resend = new Resend(process.env.RESEND_API_KEY!);
const fromEmail = process.env.RESEND_FROM_EMAIL || "Fotno <noreply@fotno.com>";

export type EmailBranding = {
  photographerName: string;
  logoUrl: string | null;
};

export const sendMail = async ({
  to,
  subject,
  text,
  branding,
  showFooterLinks,
  preheaderText,
}: {
  to: string;
  subject: string;
  text: string;
  branding?: EmailBranding;
  showFooterLinks?: boolean;
  preheaderText?: string;
}) => {
  const html = wrapEmailLayout(text, {
    photographerBranding: branding
      ? { name: branding.photographerName, logoUrl: branding.logoUrl }
      : undefined,
    showFooterLinks,
    preheaderText,
  });

  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error({ error });
  }
};
