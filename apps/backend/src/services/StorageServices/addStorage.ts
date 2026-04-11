import { checkAndSendWarningEmails } from "./checkAndSendWarningEmails";
import { nonNegative, prisma, resolvePlanLimit, safeBigInt } from "./_shared";
import type { StorageReason } from "./types";

export const addStorage = async (
  userId: string,
  bytes: bigint,
  reason: StorageReason,
  photoId?: string,
) => {
  const normalized = nonNegative(bytes);

  const updated = await prisma.$transaction(async (tx: any) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        storageUsed: true,
        storageLimit: true,
        overageBytes: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const currentUsed = safeBigInt(user.storageUsed);
    const currentLimit = safeBigInt(user.storageLimit);
    const resolvedLimit = currentLimit > 0n ? currentLimit : resolvePlanLimit(user.plan);
    const currentOverage = safeBigInt(user.overageBytes);

    const newUsed = currentUsed + normalized;
    const previousOverflow = currentUsed > resolvedLimit ? currentUsed - resolvedLimit : 0n;
    const newOverflow = newUsed > resolvedLimit ? newUsed - resolvedLimit : 0n;
    const overageDelta = newOverflow - previousOverflow;
    const newOverage = nonNegative(currentOverage + overageDelta);

    const nextUser = await tx.user.update({
      where: { id: userId },
      data: {
        storageUsed: newUsed,
        storageLimit: resolvedLimit,
        overageBytes: newOverage,
      },
      select: {
        storageUsed: true,
        storageLimit: true,
        overageBytes: true,
      },
    });

    await tx.storageEvent.create({
      data: {
        userId,
        photoId: photoId ?? null,
        delta: normalized,
        reason,
      },
    });

    return {
      used: safeBigInt(nextUser.storageUsed),
      limit: safeBigInt(nextUser.storageLimit),
      overageBytes: safeBigInt(nextUser.overageBytes),
    };
  });

  await checkAndSendWarningEmails(userId);
  return updated;
};
