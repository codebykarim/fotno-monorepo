import { publishedGalleryWhere, db } from "./_shared";
import { stripe } from "../SubscriptionServices/stripe";

const PLATFORM_FEE_PERCENT = parseFloat(
  process.env.SMART_ALBUM_PLATFORM_FEE_PERCENT || "10",
);

export const confirmSmartAlbumPayment = async (
  shareToken: string,
  designId: string,
  paymentIntentId: string,
) => {
  if (!stripe) {
    return { error: "Stripe not configured", status: 500 as const };
  }

  try {
    // Verify gallery
    const gallery = await db.gallery.findFirst({
      where: publishedGalleryWhere(shareToken),
      select: { id: true },
    });

    if (!gallery) {
      return { error: "Gallery not found", status: 404 as const };
    }

    // Verify design belongs to this gallery
    const design = await db.smartAlbumDesign.findFirst({
      where: { id: designId, galleryId: gallery.id },
      select: {
        id: true,
        status: true,
        submissions: {
          where: { status: "PENDING" },
          orderBy: { version: "desc" },
          take: 1,
          select: { id: true, transaction: { select: { id: true } } },
        },
      },
    });

    if (!design) {
      return { error: "Design not found", status: 404 as const };
    }

    const submission = design.submissions[0];
    if (!submission) {
      return { error: "No pending submission found", status: 400 as const };
    }

    // Idempotency: if transaction already recorded
    if (submission.transaction) {
      return { data: { success: true, submissionId: submission.id } };
    }

    // Verify PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Verify this PaymentIntent actually belongs to this submission
    if (paymentIntent.metadata?.submission_id !== submission.id) {
      return {
        error: "PaymentIntent does not match this submission",
        status: 400 as const,
      };
    }

    if (paymentIntent.status !== "succeeded") {
      return {
        error: `Payment not yet succeeded (status: ${paymentIntent.status})`,
        status: 400 as const,
      };
    }

    const amountCents = paymentIntent.amount;
    const feeCents = Math.round(amountCents * (PLATFORM_FEE_PERCENT / 100));
    const netCents = amountCents - feeCents;
    const currency = paymentIntent.currency?.toUpperCase() || "USD";

    // Record transaction
    await db.smartAlbumTransaction.create({
      data: {
        submissionId: submission.id,
        stripePaymentIntentId: paymentIntentId,
        amountCents,
        feeCents,
        netCents,
        currency,
        status: "SUCCEEDED",
        paidAt: new Date(),
      },
    });

    return { data: { success: true, submissionId: submission.id } };
  } catch (err: any) {
    return { error: err.message, status: 500 as const };
  }
};
