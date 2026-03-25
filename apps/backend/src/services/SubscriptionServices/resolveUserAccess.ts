import { prisma } from "@workspace/db";
import { storageTierToBytes } from "../../constants/storage";
import { getFreeTierLimits } from "../../constants/plans";

export type UserAccessStatus =
  | "free"
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
  galleryLimit?: number | null;
  galleryCount?: number;
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
      storageUsed: true,
      galleryLimit: true,
      trialEndsAt: true,
    },
  });

  if (!user) {
    return buildNoSubscriptionAccess();
  }

  // Free tier: read limits from PricingTier (single source of truth)
  if (user.plan === "FREE") {
    const freeLimits = await getFreeTierLimits();
    const storageLimitBytes = freeLimits.storageLimitBytes;
    const overStorageLimit = user.storageUsed > storageLimitBytes;
    const galleryLimit = freeLimits.galleryLimit;
    const galleryCount = await (prisma as any).gallery.count({ where: { userId } });

    return {
      status: "free",
      canUpload: !overStorageLimit,
      canCreateGallery: galleryCount < galleryLimit,
      storageLimitBytes,
      galleryLimit,
      galleryCount,
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
    // Check if subscription has expired (based on endsAt)
    if (
      subscription.endsAt &&
      new Date(subscription.endsAt) < new Date()
    ) {
      await expireSubscription(userId, subscription.id);
      return buildFreeAccess(userId, user);
    }

    const storageLimitBytes =
      storageTierToBytes(subscription.storageTierGb as number);

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
      galleryLimit: null,
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
        storageTierToBytes(subscription.storageTierGb as number);

      return {
        status: "cancelled_grace",
        canUpload: true,
        canCreateGallery: true,
        storageLimitBytes,
        galleryLimit: null,
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
    return buildFreeAccess(userId, user);
  }

  // Past due subscription
  if (subscription && subscription.status === "PAST_DUE") {
    const storageLimitBytes =
      storageTierToBytes(subscription.storageTierGb as number);

    return {
      status: "past_due",
      canUpload: true,
      canCreateGallery: true,
      storageLimitBytes,
      galleryLimit: null,
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

  // No active subscription — return no_subscription for legacy TRIAL/EXPIRED users
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

/**
 * Build free tier access after a subscription expires.
 * Used as the return value after expireSubscription() downgrades the user.
 */
async function buildFreeAccess(userId: string, user: any): Promise<UserAccess> {
  const freeLimits = await getFreeTierLimits();
  const galleryLimit = freeLimits.galleryLimit;
  const galleryCount = await (prisma as any).gallery.count({ where: { userId } });
  const storageLimitBytes = freeLimits.storageLimitBytes;
  const overStorageLimit = (user.storageUsed ?? 0n) > storageLimitBytes;

  return {
    status: "free",
    canUpload: !overStorageLimit,
    canCreateGallery: galleryCount < galleryLimit,
    storageLimitBytes,
    galleryLimit,
    galleryCount,
  };
}

async function expireSubscription(
  userId: string,
  subscriptionId: string,
): Promise<void> {
  const freeLimits = await getFreeTierLimits();

  await (prisma as any).$transaction(async (tx: any) => {
    // Expire the subscription record
    await tx.subscription.update({
      where: { id: subscriptionId },
      data: { status: "EXPIRED" },
    });

    // Downgrade user to Free tier
    await tx.user.update({
      where: { id: userId },
      data: {
        plan: "FREE",
        subscribed: false,
        storageLimit: freeLimits.storageLimitBytes,
        galleryLimit: freeLimits.galleryLimit,
        downgradedAt: new Date(),
      },
    });

    // Auto-draft galleries beyond the free tier gallery limit
    const publishedGalleries = await tx.gallery.findMany({
      where: { userId, isPublished: true },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    });

    if (publishedGalleries.length > freeLimits.galleryLimit) {
      const toDraft = publishedGalleries.slice(freeLimits.galleryLimit).map((g: any) => g.id);
      await tx.gallery.updateMany({
        where: { id: { in: toDraft } },
        data: { isPublished: false },
      });
    }
  });
}
