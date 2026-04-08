import { prisma } from "@workspace/db";

interface ResendEmailReceivedPayload {
  type: "email.received";
  created_at: string;
  data: {
    email_id: string;
    created_at: string;
    from: string;
    to: string[];
    cc: string[];
    bcc: string[];
    subject: string;
    message_id: string;
    attachments: Array<{
      id: string;
      filename: string;
      content_type: string;
    }>;
  };
}

/**
 * Handles Resend `email.received` webhook events.
 * Fetches the full email content via the Resend API and stores it in the DB.
 */
export async function handleInboundEmailWebhook(
  payload: ResendEmailReceivedPayload,
) {
  const { data } = payload;

  // Idempotency: skip if we already stored this email
  const existing = await (prisma as any).inboundEmail.findUnique({
    where: { resendId: data.email_id },
    select: { id: true },
  });
  if (existing) {
    console.log(
      `[InboundEmail] Already stored email ${data.email_id}, skipping`,
    );
    return { status: "duplicate" };
  }

  // Fetch full email content (body, headers) from Resend Receiving API
  // The SDK doesn't expose /emails/receiving/{id} yet, so we call it directly.
  let text: string | null = null;
  let html: string | null = null;

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch(
        `https://api.resend.com/emails/receiving/${data.email_id}`,
        { headers: { Authorization: `Bearer ${apiKey}` } },
      );
      if (res.ok) {
        const full = await res.json();
        text = full.text ?? null;
        html = full.html ?? null;
      } else {
        console.error(
          `[InboundEmail] Resend API returned ${res.status} for ${data.email_id}`,
        );
      }
    } catch (err) {
      console.error(
        `[InboundEmail] Failed to fetch full email ${data.email_id}:`,
        err,
      );
      // Still store metadata even if body fetch fails
    }
  }

  const sentAt = new Date(data.created_at);
  if (isNaN(sentAt.getTime())) {
    console.error(
      `[InboundEmail] Invalid created_at date: ${data.created_at}`,
    );
    return { status: "error", reason: "invalid date" };
  }

  const inboundEmail = await (prisma as any).inboundEmail.create({
    data: {
      resendId: data.email_id,
      from: data.from,
      to: data.to,
      cc: data.cc ?? [],
      bcc: data.bcc ?? [],
      subject: data.subject ?? "(no subject)",
      text,
      html,
      sentAt,
    },
  });

  console.log(
    `[InboundEmail] Stored email ${inboundEmail.id} from ${data.from}: "${data.subject}"`,
  );

  return { status: "created", id: inboundEmail.id };
}
