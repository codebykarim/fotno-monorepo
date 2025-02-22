import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async ({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) => {
  const { data, error } = await resend.emails.send({
    from: "support@fotno.com",
    to: [to],
    subject: subject,
    html: text,
  });

  if (error) {
    return console.error({ error, hi: "hi" });
  }

  console.log({ data });
};
