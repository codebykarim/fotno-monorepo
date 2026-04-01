import { publishedGalleryWhere, db } from "./_shared";
import { sendAlbumNotification } from "../SmartAlbumServices/sendAlbumNotification";
import { stripe } from "../SubscriptionServices/stripe";

const PLATFORM_FEE_PERCENT = parseFloat(
  process.env.SMART_ALBUM_PLATFORM_FEE_PERCENT || "10",
);

export const submitSmartAlbumDesign = async (
  shareToken: string,
  designId: string,
) => {
  // Verify gallery exists and is published
  const gallery = await db.gallery.findFirst({
    where: publishedGalleryWhere(shareToken),
    select: {
      id: true,
      title: true,
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });

  if (!gallery) {
    return { error: "Gallery not found", status: 404 };
  }

  // Fetch the design
  const design = await db.smartAlbumDesign.findFirst({
    where: {
      id: designId,
      galleryId: gallery.id,
    },
    select: {
      id: true,
      status: true,
      title: true,
      clientName: true,
      clientEmail: true,
      designData: true,
      product: {
        select: {
          id: true,
          name: true,
          priceCents: true,
          currency: true,
          config: {
            select: {
              paymentMethod: true,
              stripeConnectAccountId: true,
              stripeConnectOnboarded: true,
            },
          },
        },
      },
      submissions: {
        select: { version: true },
        orderBy: { version: "desc" },
        take: 1,
      },
    },
  });

  if (!design) {
    return { error: "Design not found", status: 404 };
  }

  if (design.status !== "DRAFT" && design.status !== "CHANGES_REQUESTED") {
    return {
      error: `Cannot submit design with status ${design.status}. Only DRAFT or CHANGES_REQUESTED designs can be submitted.`,
      status: 400,
    };
  }

  // Validate: design must have at least one spread with an image
  const designData = design.designData as any;
  const hasImage =
    (designData?.cover?.slots || []).some((s: any) => s.photoId) ||
    (designData?.firstPage?.slots || []).some((s: any) => s.photoId) ||
    (designData?.spreads || []).some((spread: any) =>
      (spread.slots || []).some((s: any) => s.photoId),
    ) ||
    (designData?.lastPage?.slots || []).some((s: any) => s.photoId);

  if (!hasImage) {
    return {
      error: "Album must have at least one image before submitting",
      status: 400,
    };
  }

  // Determine if payment is required
  const paymentMethod = design.product.config?.paymentMethod;
  const requiresPayment =
    paymentMethod === "INSIDE_FOTNO" &&
    stripe !== null &&
    !!design.product.config?.stripeConnectAccountId &&
    design.product.config?.stripeConnectOnboarded === true;

  // Calculate next version number
  const nextVersion = (design.submissions[0]?.version ?? 0) + 1;

  // Create submission and update design status atomically
  const [submission] = await db.$transaction([
    db.smartAlbumSubmission.create({
      data: {
        designId: design.id,
        version: nextVersion,
        designSnapshot: designData,
        status: "PENDING",
      },
      select: {
        id: true,
        version: true,
        status: true,
        submittedAt: true,
      },
    }),
    db.smartAlbumDesign.update({
      where: { id: design.id },
      data: { status: "SUBMITTED" },
    }),
  ]);

  // Send notification to photographer (fire and forget)
  const dashboardUrl = process.env.DASHBOARD_URL || "https://app.fotno.com";
  sendAlbumNotification({
    type: "submitted",
    photographerEmail: gallery.user.email,
    photographerName: gallery.user.name,
    clientName: design.clientName,
    albumTitle: design.title,
    galleryTitle: gallery.title,
    reviewUrl: `${dashboardUrl}/smart-albums/submissions/${submission.id}`,
  }).catch((err) => console.error("Failed to send album submission email:", err));

  // If in-platform payment, create Stripe PaymentIntent and return clientSecret
  if (requiresPayment) {
    const connectAccountId = design.product.config!.stripeConnectAccountId as string;
    const amountCents = design.product.priceCents;
    const currency = (design.product.currency || "USD").toLowerCase();
    const feeCents = Math.round(amountCents * (PLATFORM_FEE_PERCENT / 100));

    try {
      const paymentIntent = await stripe!.paymentIntents.create({
        amount: amountCents,
        currency,
        application_fee_amount: feeCents,
        transfer_data: { destination: connectAccountId },
        metadata: {
          submission_id: submission.id,
          design_id: design.id,
        },
      });

      return {
        submission,
        payment: {
          clientSecret: paymentIntent.client_secret,
          amountCents,
          currency: currency.toUpperCase(),
        },
      };
    } catch (stripeErr: any) {
      // Rollback: delete the submission and revert design to original status
      console.error("Failed to create PaymentIntent, rolling back submission:", stripeErr);
      await db.$transaction([
        db.smartAlbumSubmission.delete({ where: { id: submission.id } }),
        db.smartAlbumDesign.update({
          where: { id: design.id },
          data: { status: design.status },
        }),
      ]);
      return {
        error: "Failed to initiate payment. Please try again.",
        status: 500,
      };
    }
  }

  return { submission };
};
