import { prisma } from "@workspace/db";
import { TRIAL_STORAGE_LIMIT, STORAGE_TIER_LIMITS } from "../../constants/storage";

export type UserAccessStatus =
  | "trial"
  | "active"
  | "past_due"
  | "cancelled_grace"
  | "expired";

export type UserAccess = {
  status: UserAccessStatus;
  canUpload: boolean;
  canCreateGallery: boolean;
  storageLimitBytes: bigint;
  trialDaysRemaining?: number;
  subscription?: {
    id: string;
    source: string;
    status: string;
    storageTierGb: number;
    currentPeriodEnd: Date | null;
    cancelledAt: Date | null;
    endsAt: Date | null;
  };
};

export const resolveUserAccess = async (
  userId: string,
): Promise<UserAccess> => {
  const user = await (prisma as any).user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      plan: true,
      trialEndsAt: true,
      storageLimit: true,
    },
  });

  if (!user) {
    return {
      status: "expired",
      canUpload: false,
      canCreateGallery: false,
      storageLimitBytes: 0n,
    };
  }

  // Check for active subscription first
  const subscription = await (prisma as any).subscription.findFirst({
    where: {
      userId,
      status: { in: ["ACTIVE", "CANCELLED", "PAST_DUE"] },
    },
    orderBy: { createdAt: "desc" },
  });

  // Active subscription
  if (subscription && subscription.status === "ACTIVE") {
    // Check if manual subscription has expired
    if (
      subscription.source === "MANUAL" &&
      subscription.endsAt &&
      new Date(subscription.endsAt) < new Date()
    ) {
      await expireSubscription(userId, subscription.id);
      return buildExpiredAccess();
    }

    const storageLimitBytes =
      STORAGE_TIER_LIMITS[subscription.storageTierGb as number] ??
      TRIAL_STORAGE_LIMIT;

    return {
      status: "active",
      canUpload: true,
      canCreateGallery: true,
      storageLimitBytes,
      subscription: {
        id: subscription.id,
        source: subscription.source,
        status: subscription.status,
        storageTierGb: subscription.storageTierGb,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelledAt: subscription.cancelledAt,
        endsAt: subscription.endsAt,
      },
    };
  }

  // Cancelled but still in grace period (until period end)
  if (subscription && subscription.status === "CANCELLED") {
    const periodEnd = subscription.currentPeriodEnd || subscription.endsAt;
    if (periodEnd && new Date(periodEnd) > new Date()) {
      const storageLimitBytes =
        STORAGE_TIER_LIMITS[subscription.storageTierGb as number] ??
        TRIAL_STORAGE_LIMIT;

      return {
        status: "cancelled_grace",
        canUpload: true,
        canCreateGallery: true,
        storageLimitBytes,
        subscription: {
          id: subscription.id,
          source: subscription.source,
          status: subscription.status,
          storageTierGb: subscription.storageTierGb,
          currentPeriodEnd: subscription.currentPeriodEnd,
          cancelledAt: subscription.cancelledAt,
          endsAt: subscription.endsAt,
        },
      };
    }
    // Grace period over
    await expireSubscription(userId, subscription.id);
    return buildExpiredAccess();
  }

  // Past due subscription
  if (subscription && subscription.status === "PAST_DUE") {
    const storageLimitBytes =
      STORAGE_TIER_LIMITS[subscription.storageTierGb as number] ??
      TRIAL_STORAGE_LIMIT;

    return {
      status: "past_due",
      canUpload: true,
      canCreateGallery: true,
      storageLimitBytes,
      subscription: {
        id: subscription.id,
        source: subscription.source,
        status: subscription.status,
        storageTierGb: subscription.storageTierGb,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelledAt: subscription.cancelledAt,
        endsAt: subscription.endsAt,
      },
    };
  }

  // No active subscription — check trial
  if (user.plan === "TRIAL" && user.trialEndsAt) {
    const now = new Date();
    const trialEnd = new Date(user.trialEndsAt);

    if (trialEnd > now) {
      const trialDaysRemaining = Math.ceil(
        (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      return {
        status: "trial",
        canUpload: true,
        canCreateGallery: true,
        storageLimitBytes: TRIAL_STORAGE_LIMIT,
        trialDaysRemaining,
      };
    }

    // Trial has expired — lazily update user plan
    await (prisma as any).user.update({
      where: { id: userId },
      data: { plan: "EXPIRED" },
    });
  }

  return buildExpiredAccess();
};

function buildExpiredAccess(): UserAccess {
  return {
    status: "expired",
    canUpload: false,
    canCreateGallery: false,
    storageLimitBytes: 0n,
  };
}

async function expireSubscription(
  userId: string,
  subscriptionId: string,
): Promise<void> {
  await (prisma as any).$transaction([
    (prisma as any).subscription.update({
      where: { id: subscriptionId },
      data: { status: "EXPIRED" },
    }),
    (prisma as any).user.update({
      where: { id: userId },
      data: { plan: "EXPIRED", subscribed: false },
    }),
  ]);
}
