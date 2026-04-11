import "../bootstrap";
import type { Job } from "bull";
import { prisma } from "@workspace/db";
import { ONE_MB_BYTES } from "../constants/storage";
import { scheduleDailyStorageReconciliation, storageQueue } from "../queues/storageQueue";

const toBigInt = (value: unknown): bigint => {
  if (typeof value === "bigint") {
    return value;
  }
  if (typeof value === "number") {
    return BigInt(Math.floor(value));
  }
  if (typeof value === "string" && value.length > 0) {
    return BigInt(value);
  }
  return 0n;
};

const abs = (value: bigint): bigint => (value < 0n ? -value : value);

const startWorker = async () => {
  await scheduleDailyStorageReconciliation();

  storageQueue.process(
    "reconcile-all-storage",
    async (_job: Job<Record<string, never>>) => {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          plan: true,
          storageUsed: true,
          storageLimit: true,
        },
      });

      for (const user of users) {
        const aggregate = await prisma.photo.aggregate({
          where: {
            gallery: {
              userId: user.id,
            },
            status: {
              not: "pending",
            },
          },
          _sum: {
            originalSize: true,
            thumbnailSize: true,
            previewSize: true,
          },
        });

        const actualUsed =
          toBigInt(aggregate?._sum?.originalSize) +
          toBigInt(aggregate?._sum?.thumbnailSize) +
          toBigInt(aggregate?._sum?.previewSize);
        const currentUsed = toBigInt(user.storageUsed);
        const delta = actualUsed - currentUsed;

        if (abs(delta) <= ONE_MB_BYTES) {
          continue;
        }

        const storageLimit = toBigInt(user.storageLimit);
        const overageBytes = actualUsed > storageLimit ? actualUsed - storageLimit : 0n;

        await prisma.$transaction(async (tx: any) => {
          await tx.user.update({
            where: { id: user.id },
            data: {
              storageUsed: actualUsed,
              storageLimit,
              overageBytes,
            },
          });

          await tx.storageEvent.create({
            data: {
              userId: user.id,
              delta,
              reason: "reconcile",
            },
          });
        });

        console.log(
          `[reconcile-all-storage] user=${user.id} driftBytes=${delta.toString()} corrected=${actualUsed.toString()}`,
        );
      }
    },
  );

  console.log("reconcile-all-storage worker started");
};

startWorker().catch((error) => {
  console.error("Failed to start reconcile-all-storage worker", error);
  process.exit(1);
});
