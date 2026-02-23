import { auth } from "../../auth";
import AppError from "../../errors/AppError";
import prisma from "../../../prisma";
import { Payment, PlanType } from "@prisma/client";
import { PLAN_STORAGE_LIMITS } from "../../constants/storage";

interface Request {
  email: string;
  subscriptionId: number;
  planId: number;
  planExpiresAt: Date;
  planStartedAt: Date;
  plan: PlanType;
  transactionId: number;
  initial_transaction: number;
  amount_cents: number;
}

const CreateSuccessSubscription = async ({
  email,
  subscriptionId,
  planId,
  planExpiresAt,
  planStartedAt,
  plan,
  amount_cents,
  transactionId,
  initial_transaction,
}: Request): Promise<Payment | null> => {
  const toUserPlan = (value: PlanType): string => {
    switch (value) {
      case "BEGGINER":
        return "STARTER";
      case "PRO":
        return "PROFESSIONAL";
      case "STUDIO":
      default:
        return "STUDIO";
    }
  };

  // get userId from user email
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new AppError("User not found");
  }

  // check if payment already exists
  const paymentExist = await prisma.payment.findUnique({
    where: {
      subscriptionId,
      userId: user.id,
    },
  });

  if (paymentExist) {
    return null;
  }

  const payment: Payment = await prisma.payment
    .create({
      data: {
        status: "ACTIVE",
        planId,
        plan,
        subscriptionId,
        planExpiresAt,
        planStartedAt,
        userId: user.id,
        amount_cents,
        transactionId,
        initial_transaction,
      },
    })
    .catch((e) => {
      console.log(e);
      throw new AppError("Error adding user payment");
    });

  await (prisma as any).user.update({
    where: {
      id: user.id,
    },
    data: {
      subscribed: true,
      finishOnboarding: true,
      plan: toUserPlan(plan) as any,
      storageLimit: PLAN_STORAGE_LIMITS[toUserPlan(plan)],
    },
  });

  return payment;
};

export default CreateSuccessSubscription;
