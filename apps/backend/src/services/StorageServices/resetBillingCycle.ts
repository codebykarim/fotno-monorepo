import { prisma } from "./_shared";

export const resetBillingCycle = async (userId: string): Promise<void> => {
  await (prisma as any).$transaction(async (tx: any) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        overageBytes: 0n,
        warningEmailSent80: false,
        warningEmailSent95: false,
        overageResetAt: new Date(),
      },
    });

    await tx.storageEvent.create({
      data: {
        userId,
        delta: 0n,
        reason: "billing_cycle_reset",
      },
    });
  });
};
