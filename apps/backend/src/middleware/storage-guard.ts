import type { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import { prisma } from "@workspace/db";
import { PLAN_STORAGE_LIMITS } from "../constants/storage";
import { getStorageSummary } from "../services/StorageServices";

const toBigInt = (value: unknown, fallback = 0n): bigint => {
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

const storageGuard = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await (prisma as any).user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      storageUsed: true,
      storageLimit: true,
      overageBytes: true,
    },
  });

  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  const bodySize = Number(req.body?.size ?? 0);
  const headerLength = Number(req.headers["content-length"] ?? 0);
  const reportedBytes = BigInt(Math.max(0, Number.isFinite(bodySize) && bodySize > 0 ? bodySize : headerLength));

  const storageUsed = toBigInt(user.storageUsed);
  const resolvedLimit = toBigInt(user.storageLimit) > 0n
    ? toBigInt(user.storageLimit)
    : PLAN_STORAGE_LIMITS[String(user.plan)] ?? PLAN_STORAGE_LIMITS.FREE;
  const projectedUsed = storageUsed + reportedBytes;
  const isPaidPlan = String(user.plan) !== "FREE";

  req.storageSummary = await getStorageSummary(userId);

  if (!isPaidPlan && resolvedLimit > 0n && storageUsed >= resolvedLimit) {
    req.storageSummary.freePlanBlocked = true;
    return next();
  }

  if (isPaidPlan && resolvedLimit > 0n && projectedUsed > resolvedLimit) {
    res.setHeader("X-Storage-Overage", "true");
  }

  return next();
};

export default storageGuard;
