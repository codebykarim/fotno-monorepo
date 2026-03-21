import { prisma } from "@workspace/db";
import { STORAGE_TIER_LIMITS } from "../../constants/storage";

export type UserAccessStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "cancelled_grace"
  | "no_subscription";

export type UserAccess = {
  status: UserAccessStatus;
  canUpload: boolean;
  canCreateGallery: boolean;
  storageLimitBytes: bigint;
  trialEndsAt?: Date | null;
  trialDaysLeft?: number;
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
      storageLimit: true,
      trialEndsAt: true,
    },
  });

  if (!user) {
    return buildNoSubscriptionAccess();
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
    // Check if subscription has expired (based on endsAt)
    if (
      subscription.endsAt &&
      new Date(subscription.endsAt) < new Date()
    ) {
      await expireSubscription(userId, subscription.id);
      return buildNoSubscriptionAccess();
    }

    const storageLimitBytes =
      STORAGE_TIER_LIMITS[subscription.storageTierGb as number] ?? 0n;

    const TRIAL_DAYS = 14;
    let trialEndsAt = user.trialEndsAt ? new Date(user.trialEndsAt) : null;
    // Fallback: if trialEndsAt was never set, infer from subscription creation date
    if (!trialEndsAt && subscription.createdAt) {
      const inferredEnd = new Date(subscription.createdAt);
      inferredEnd.setDate(inferredEnd.getDate() + TRIAL_DAYS);
      if (inferredEnd > new Date()) {
        trialEndsAt = inferredEnd;
      }
    }
    const isTrialing = trialEndsAt !== null && trialEndsAt > new Date();
    const trialDaysLeft = isTrialing
      ? Math.ceil((trialEndsAt!.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : undefined;

    return {
      status: isTrialing ? "trialing" : "active",
      canUpload: true,
      canCreateGallery: true,
      storageLimitBytes,
      ...(isTrialing ? { trialEndsAt, trialDaysLeft } : {}),
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
        STORAGE_TIER_LIMITS[subscription.storageTierGb as number] ?? 0n;

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
    return buildNoSubscriptionAccess();
  }

  // Past due subscription
  if (subscription && subscription.status === "PAST_DUE") {
    const storageLimitBytes =
      STORAGE_TIER_LIMITS[subscription.storageTierGb as number] ?? 0n;

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

  // No active subscription — user must choose a plan
  return buildNoSubscriptionAccess();
};

function buildNoSubscriptionAccess(): UserAccess {
  return {
    status: "no_subscription",
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
