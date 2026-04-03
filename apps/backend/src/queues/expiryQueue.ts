import Bull, { JobOptions, Queue } from "bull";

export type ExpiredGalleryCleanupJobData = Record<string, never>;

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("Missing REDIS_URL environment variable");
}

export const expiryQueue: Queue<ExpiredGalleryCleanupJobData> = new Bull(
  "gallery-expiry",
  redisUrl,
);

const defaultJobOptions: JobOptions = {
  attempts: 2,
  removeOnComplete: true,
  removeOnFail: false,
};

export const scheduleDailyExpiryCleanup = async (): Promise<void> => {
  await expiryQueue.add(
    "cleanup-expired-galleries",
    {},
    {
      ...defaultJobOptions,
      jobId: "cleanup-expired-galleries-daily",
      repeat: {
        cron: "0 4 * * *",
      },
    },
  );
};
