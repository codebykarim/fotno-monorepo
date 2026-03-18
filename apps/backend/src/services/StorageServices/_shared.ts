import { Resend } from "resend";
import { prisma } from "@workspace/db";
import { TRIAL_STORAGE_LIMIT } from "../../constants/storage";

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const safeBigInt = (value: unknown, fallback = 0n): bigint => {
  if (typeof value === "bigint") {
    return value;
  }
  if (typeof value === "number") {
    return BigInt(Math.floor(value));
  }
  if (typeof value === "string" && value.length > 0) {
    return BigInt(value);
  }
  return fallback;
};

export const resolvePlanLimit = (plan: unknown, storageLimit?: bigint): bigint => {
  if (storageLimit && storageLimit > 0n) {
    return storageLimit;
  }
  return TRIAL_STORAGE_LIMIT;
};

export const nonNegative = (value: bigint): bigint => (value < 0n ? 0n : value);

export const fetchUserStorage = async (userId: string) => {
  const user = await (prisma as any).user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      plan: true,
      storageUsed: true,
      storageLimit: true,
      overageBytes: true,
      warningEmailSent80: true,
      warningEmailSent95: true,
      email: true,
      name: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export { prisma };
