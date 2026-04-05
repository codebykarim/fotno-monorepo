import Plunk from "@plunk/node";
import { wrapEmailLayout } from "../emails/layout";

const plunk = new Plunk(process.env.PLUNK_API_KEY!, { baseUrl: process.env.PLUNK_API_URL || "https://plunk.fotno.com/api/v1/" });

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
    await plunk.emails.send({
      to,
      subject,
      body: html,
    });
  } catch (error) {
    console.error({ error });
  }
};
