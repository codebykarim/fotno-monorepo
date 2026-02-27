import Bull, { JobOptions, Queue } from "bull";

/**
 * Job data for S3/R2 asset deletion. Keys are S3 object keys (originals, thumbnails, previews).
 */
export type CleanupPhotoJobData = {
  keys: string[];
};

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("Missing REDIS_URL environment variable");
}

/**
 * Bull queue for best-effort deletion of photo assets from S3/R2.
 * Used when a user deletes a photo or gallery; the worker deletes original, thumbnail, and preview objects.
 */
export const cleanupQueue: Queue<CleanupPhotoJobData> = new Bull(
  "photo-cleanup",
  redisUrl,
);

const defaultJobOptions: JobOptions = {
  attempts: 3,
  removeOnComplete: true,
  removeOnFail: false,
  backoff: {
    type: "exponential",
    delay: 2000,
  },
};

/**
 * Enqueues a job to delete the given S3/R2 object keys. Used after deleting a photo or gallery.
 * Empty keys are filtered out. The cleanup worker runs in the backend process (or standalone).
 */
export const enqueuePhotoCleanup = async (keys: string[]): Promise<void> => {
  await cleanupQueue.add(
    "cleanup-photo-assets",
    { keys: keys.filter((key) => key.trim().length > 0) },
    defaultJobOptions,
  );
};
