import "../bootstrap";
import type { Job } from "bull";
import { prisma } from "@workspace/db";
import { deleteGallery } from "../services/DashboardServices/deleteGallery";
import {
  expiryQueue,
  scheduleDailyExpiryCleanup,
} from "../queues/expiryQueue";
import { sendPushNotification } from "../utils/fcm";

const db = prisma;

/**
 * Send notifications to users whose storage usage exceeds 85%.
 */
async function notifyStorageWarning(): Promise<void> {
  // Find users where storageUsed >= 85% of storageLimit
  // Using raw query since Prisma doesn't support column-to-column comparison easily
  const usersNearLimit: Array<{ id: string; name: string; storageUsed: bigint; storageLimit: bigint }> =
    await db.$queryRaw`
      SELECT id, name, "storageUsed", "storageLimit"
      FROM "user"
      WHERE "storageLimit" > 0
        AND "storageUsed" >= ("storageLimit" * 85 / 100)
        AND "plan" != 'EXPIRED'
    `;

  for (const user of usersNearLimit) {
    const pct = Math.round(
      (Number(user.storageUsed) / Number(user.storageLimit)) * 100,
    );
    await sendPushNotification(
      user.id,
      "storageWarning",
      "Storage Almost Full",
      `You've used ${pct}% of your storage. Consider upgrading your plan or freeing up space.`,
      { storagePercent: String(pct) },
    );
  }

  if (usersNearLimit.length > 0) {
    console.log(
      `[storage-warning] sent notifications to ${usersNearLimit.length} user(s)`,
    );
  }
}

/**
 * Send reminders for galleries expiring within the next 3 days.
 */
async function notifyUpcomingExpiry(): Promise<void> {
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const soonExpiring = await db.gallery.findMany({
    where: {
      expiresAt: {
        gt: now,
        lte: threeDaysFromNow,
      },
    },
    select: {
      id: true,
      userId: true,
      title: true,
      expiresAt: true,
    },
  });

  for (const gallery of soonExpiring) {
    const daysLeft = Math.ceil(
      (new Date(gallery.expiresAt!).getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    await sendPushNotification(
      gallery.userId,
      "galleryExpiry",
      "Gallery Expiring Soon",
      `Your gallery "${gallery.title}" will be deleted in ${daysLeft} day${daysLeft === 1 ? "" : "s"}.`,
      { galleryId: gallery.id },
    );
  }

  if (soonExpiring.length > 0) {
    console.log(
      `[cleanup-expired-galleries] sent expiry reminders for ${soonExpiring.length} gallery(ies)`,
    );
  }
}

export const startExpiryWorker = async (): Promise<void> => {
  await scheduleDailyExpiryCleanup();

  expiryQueue.process(
    "cleanup-expired-galleries",
    async (_job: Job<Record<string, never>>) => {
      // Send storage warning notifications
      await notifyStorageWarning();

      // Send reminders for galleries expiring soon
      await notifyUpcomingExpiry();

      // Then, delete already-expired galleries
      const expiredGalleries = await db.gallery.findMany({
        where: {
          expiresAt: { lt: new Date() },
        },
        select: {
          id: true,
          userId: true,
          title: true,
        },
      });

      if (expiredGalleries.length === 0) {
        console.log("[cleanup-expired-galleries] no expired galleries found");
        return;
      }

      console.log(
        `[cleanup-expired-galleries] found ${expiredGalleries.length} expired gallery(ies)`,
      );

      for (const gallery of expiredGalleries) {
        try {
          const deleted = await deleteGallery(gallery.userId, gallery.id);
          if (deleted) {
            console.log(
              `[cleanup-expired-galleries] deleted gallery="${gallery.title}" id=${gallery.id}`,
            );
          }
        } catch (error) {
          console.error(
            `[cleanup-expired-galleries] failed to delete gallery id=${gallery.id}:`,
            error,
          );
        }
      }
    },
  );

  console.log("cleanup-expired-galleries worker started");
};

if (require.main === module) {
  startExpiryWorker().catch((error) => {
    console.error("Failed to start expiry worker", error);
    process.exit(1);
  });
}
