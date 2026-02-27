import "../bootstrap";
import type { Job } from "bull";
import { cleanupQueue } from "../queues/photoQueue";
import { deleteS3Object } from "../utils/s3";

/**
 * Starts the photo-asset cleanup worker. Processes jobs from the photo-cleanup Bull queue.
 * For each job, deletes the given S3/R2 object keys (originals, thumbnails, previews).
 * Used when users delete photos or galleries. Runs in the API process by default, or standalone via pnpm run worker:cleanup.
 */
export const startCleanupWorker = async (): Promise<void> => {
  cleanupQueue.process(
    "cleanup-photo-assets",
    async (job: Job<{ keys: string[] }>) => {
      const keys = Array.from(
        new Set((job.data.keys ?? []).filter((key) => key.trim().length > 0)),
      );

      if (keys.length === 0) {
        return;
      }

      const deletionResults = await Promise.allSettled(
        keys.map(async (key) => {
          await deleteS3Object(key);
          return key;
        }),
      );

      const failedKeys = deletionResults
        .map((result, index) => ({ result, key: keys[index] }))
        .filter(
          (
            item,
          ): item is {
            result: PromiseRejectedResult;
            key: string;
          } => item.result.status === "rejected",
        )
        .map((item) => item.key);

      if (failedKeys.length > 0) {
        throw new Error(
          `Failed to delete ${failedKeys.length} S3/R2 object(s): ${failedKeys.join(", ")}`,
        );
      }

      console.log(`[cleanup-photo-assets] deleted ${keys.length} object(s)`);
    },
  );

  cleanupQueue.on("failed", (job: Job | undefined, error: Error) => {
    const keyCount = Array.isArray(job?.data?.keys) ? job.data.keys.length : 0;
    console.error(
      `cleanup-photo-assets failed for ${keyCount} key(s):`,
      error.message,
    );
  });

  console.log("cleanup-photo-assets worker started");
};

if (require.main === module) {
  startCleanupWorker().catch((error) => {
    console.error("Failed to start cleanup worker", error);
    process.exit(1);
  });
}
