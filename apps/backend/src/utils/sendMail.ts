import { Resend } from "resend";
import { wrapEmailLayout } from "../emails/layout";

const resend = new Resend(process.env.RESEND_API_KEY!);
const fromEmail = process.env.RESEND_FROM_EMAIL || "Fotno <hello@fotno.com>";

export const sendMail = async ({
  to,
  subject,
  text,
  preheaderText,
}: {
  to: string;
  subject: string;
  text: string;
  preheaderText?: string;
}) => {
  const html = wrapEmailLayout(text, { preheaderText });

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
