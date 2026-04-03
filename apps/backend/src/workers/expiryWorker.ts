import "../bootstrap";
import type { Job } from "bull";
import { prisma } from "@workspace/db";
import { deleteGallery } from "../services/DashboardServices/deleteGallery";
import {
  expiryQueue,
  scheduleDailyExpiryCleanup,
} from "../queues/expiryQueue";

const db = prisma as any;

export const startExpiryWorker = async (): Promise<void> => {
  await scheduleDailyExpiryCleanup();

  expiryQueue.process(
    "cleanup-expired-galleries",
    async (_job: Job<Record<string, never>>) => {
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
