import Plunk from "@plunk/node";

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
}: {
  to: string;
  subject: string;
  text: string;
  branding?: EmailBranding;
}) => {
  const brandingHeader = branding
    ? `${branding.logoUrl ? `<img src="${branding.logoUrl}" alt="${branding.photographerName}" style="max-height:60px;margin-bottom:16px;" /><br/>` : `<p style="font-weight:bold;font-size:18px;margin-bottom:16px;">${branding.photographerName}</p>`}`
    : "";
  const html = brandingHeader ? `${brandingHeader}${text}` : text;

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
