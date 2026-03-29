import { stripe } from "./stripe";
import AppError from "../../errors/AppError";
import { prisma } from "@workspace/db";

export const createSetupIntent = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, stripeCustomerId: true },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  let stripeCustomerId = user.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name || undefined,
      metadata: { userId },
    });
    stripeCustomerId = customer.id;
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId },
    });
  }

  const setupIntent = await stripe.setupIntents.create({
    customer: stripeCustomerId,
    usage: "off_session",
    automatic_payment_methods: { enabled: true },
    metadata: { user_id: userId },
  });

  return {
    data: {
      clientSecret: setupIntent.client_secret,
    },
    status: 201,
  };
};
