import { db } from "./_shared";

export const upsertConfig = async (userId: string, body: any) => {
  try {
    const { enabled, paymentMethod } = body;

    // Validate paymentMethod if provided
    if (
      paymentMethod &&
      !["OUTSIDE_FOTNO", "INSIDE_FOTNO"].includes(paymentMethod)
    ) {
      return {
        error: 'paymentMethod must be "OUTSIDE_FOTNO" or "INSIDE_FOTNO"',
        status: 400 as const,
      };
    }

    // Validate Stripe Connect onboarding is complete before allowing INSIDE_FOTNO
    if (paymentMethod === "INSIDE_FOTNO") {
      const existing = await db.smartAlbumConfig.findUnique({
        where: { userId },
        select: { stripeConnectOnboarded: true },
      });
      if (!existing?.stripeConnectOnboarded) {
        return {
          error: "Stripe Connect onboarding must be completed before enabling in-platform payments",
          status: 400 as const,
        };
      }
    }

    const config = await db.smartAlbumConfig.upsert({
      where: { userId },
      create: {
        userId,
        ...(typeof enabled === "boolean" && { enabled }),
        ...(paymentMethod && { paymentMethod }),
      },
      update: {
        ...(typeof enabled === "boolean" && { enabled }),
        ...(paymentMethod && { paymentMethod }),
      },
      include: { products: true },
    });

    return { data: config };
  } catch (err: any) {
    return { error: err.message, status: 500 as const };
  }
};
