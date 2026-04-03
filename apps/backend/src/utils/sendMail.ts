import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

  const { data, error } = await resend.emails.send({
    from: "Fotno <support@fotno.com>",
    to: [to],
    subject: subject,
    html,
  });

  if (error) {
    return console.error({ error, hi: "hi" });
  }

  console.log({ data });
};
