import { prisma } from "@workspace/db";
import { findTierByGb } from "../../constants/plans";
import { STORAGE_TIER_LIMITS } from "../../constants/storage";
import AppError from "../../errors/AppError";

export const createManualPlanRequest = async ({
  userId,
  storageTierGb,
}: {
  userId: string;
  storageTierGb: number;
}) => {
  const tier = findTierByGb(storageTierGb);
  if (!tier) {
    throw new AppError("Invalid storage tier", 400);
  }

  // Check for existing pending request
  const existing = await (prisma as any).manualPlanRequest.findFirst({
    where: { userId, status: "PENDING" },
  });

  if (existing) {
    throw new AppError("You already have a pending plan request", 400);
  }

  const request = await (prisma as any).manualPlanRequest.create({
    data: {
      userId,
      storageTierGb,
      status: "PENDING",
    },
  });

  return request;
};

export const getUserManualPlanRequest = async (userId: string) => {
  return (prisma as any).manualPlanRequest.findFirst({
    where: { userId, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });
};

export const listManualPlanRequests = async ({
  status,
  page = 1,
  pageSize = 20,
}: {
  status?: string;
  page?: number;
  pageSize?: number;
}) => {
  const where = status && status !== "all" ? { status } : {};

  const [requests, total] = await Promise.all([
    (prisma as any).manualPlanRequest.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, plan: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    (prisma as any).manualPlanRequest.count({ where }),
  ]);

  return { requests, total, page, pageSize };
};

export const approveManualPlanRequest = async ({
  requestId,
  adminUserId,
  expiresAt,
  adminNotes,
}: {
  requestId: string;
  adminUserId: string;
  expiresAt: Date;
  adminNotes?: string;
}) => {
  const request = await (prisma as any).manualPlanRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new AppError("Plan request not found", 404);
  }

  if (request.status !== "PENDING") {
    throw new AppError("This request has already been processed", 400);
  }

  const tier = findTierByGb(request.storageTierGb);
  if (!tier) {
    throw new AppError("Invalid storage tier on request", 500);
  }

  const storageLimit = STORAGE_TIER_LIMITS[request.storageTierGb];

  await (prisma as any).$transaction([
    (prisma as any).manualPlanRequest.update({
      where: { id: requestId },
      data: {
        status: "APPROVED",
        reviewedBy: adminUserId,
        reviewedAt: new Date(),
        expiresAt,
        adminNotes,
      },
    }),
    (prisma as any).subscription.create({
      data: {
        userId: request.userId,
        source: "MANUAL",
        status: "ACTIVE",
        storageTierGb: request.storageTierGb,
        priceCents: tier.priceCents,
        currentPeriodStart: new Date(),
        endsAt: expiresAt,
        approvedBy: adminUserId,
        adminNotes,
      },
    }),
    (prisma as any).user.update({
      where: { id: request.userId },
      data: {
        plan: "PRO",
        subscribed: true,
        storageLimit,
      },
    }),
  ]);
};

export const rejectManualPlanRequest = async ({
  requestId,
  adminUserId,
  adminNotes,
}: {
  requestId: string;
  adminUserId: string;
  adminNotes?: string;
}) => {
  const request = await (prisma as any).manualPlanRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new AppError("Plan request not found", 404);
  }

  if (request.status !== "PENDING") {
    throw new AppError("This request has already been processed", 400);
  }

  await (prisma as any).manualPlanRequest.update({
    where: { id: requestId },
    data: {
      status: "REJECTED",
      reviewedBy: adminUserId,
      reviewedAt: new Date(),
      adminNotes,
    },
  });
};
