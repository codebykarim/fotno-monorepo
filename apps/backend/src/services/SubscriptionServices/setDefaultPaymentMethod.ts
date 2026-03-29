import { stripe } from "./stripe";
import AppError from "../../errors/AppError";
import { prisma } from "@workspace/db";

/**
 * After a SetupIntent succeeds, set the confirmed payment method
 * as the customer's default for future invoices and subscriptions.
 */
export const setDefaultPaymentMethod = async ({
  userId,
  paymentMethodId,
}: {
  userId: string;
  paymentMethodId: string;
}) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    throw new AppError("No billing account found", 404);
  }

  // Verify the payment method belongs to this customer
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
  if (paymentMethod.customer !== user.stripeCustomerId) {
    throw new AppError("Payment method does not belong to this customer", 403);
  }

  await stripe.customers.update(user.stripeCustomerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  return { data: { success: true }, status: 200 };
};
