import { Request, Response } from "express";
import { Webhook } from "svix";
import { handleInboundEmailWebhook } from "../services/EmailServices/handleInboundWebhook";
import { captureWithContext } from "../utils/sentry";

const RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;

/**
 * Verify the Resend webhook signature using svix.
 * Returns the parsed payload on success, or null on failure.
 */
function verifyResendSignature(
  rawBody: Buffer | string,
  headers: Record<string, string | string[] | undefined>,
): Record<string, unknown> | null {
  if (!RESEND_WEBHOOK_SECRET) {
    console.error("[EmailWebhook] RESEND_WEBHOOK_SECRET is not configured");
    return null;
  }

  const svixId = headers["svix-id"] as string | undefined;
  const svixTimestamp = headers["svix-timestamp"] as string | undefined;
  const svixSignature = headers["svix-signature"] as string | undefined;

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("[EmailWebhook] Missing svix signature headers");
    return null;
  }

  try {
    const wh = new Webhook(RESEND_WEBHOOK_SECRET);
    const body =
      typeof rawBody === "string" ? rawBody : rawBody.toString("utf8");
    return wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as Record<string, unknown>;
  } catch (err) {
    console.error("[EmailWebhook] Signature verification failed:", err);
    return null;
  }
}

/**
 * POST /api/email/webhook
 * Receives Resend webhook events (email.received).
 */
export const inboundWebhookController = async (
  req: Request,
  res: Response,
) => {
  // 1. Verify webhook signature
  const rawBody = (req as any).rawBody as Buffer | undefined;
  const payload = rawBody
    ? verifyResendSignature(rawBody, req.headers)
    : verifyResendSignature(JSON.stringify(req.body), req.headers);

  if (!payload) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  // 2. Validate event type
  if (!payload.type) {
    return res.status(400).json({ error: "Missing event type" });
  }

  if (payload.type !== "email.received") {
    console.log(`[EmailWebhook] Ignoring event type: ${payload.type}`);
    return res.status(200).json({ received: true });
  }

  // 3. Process
  try {
    console.log(
      `[EmailWebhook] Processing ${payload.type} from ${(payload.data as any)?.from}`,
    );
    const result = await handleInboundEmailWebhook(payload as any);
    return res.status(200).json({ received: true, ...result });
  } catch (error) {
    console.error("[EmailWebhook] Error processing inbound email:", error);
    captureWithContext(error, {
      operation: "email.inbound_webhook",
      data: {
        eventType: payload.type as string,
        emailId: (payload.data as any)?.email_id,
      },
    });
    return res.status(500).json({ error: "Processing failed" });
  }
};
