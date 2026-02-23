import Bull, { JobOptions, Queue } from "bull";

export type ReconcileStorageJobData = Record<string, never>;

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("Missing REDIS_URL environment variable");
}

export const storageQueue: Queue<ReconcileStorageJobData> = new Bull(
  "storage-maintenance",
  redisUrl,
);

const defaultJobOptions: JobOptions = {
  attempts: 2,
  removeOnComplete: true,
  removeOnFail: false,
};

export const scheduleDailyStorageReconciliation = async (): Promise<void> => {
  await storageQueue.add(
    "reconcile-all-storage",
    {},
    {
      ...defaultJobOptions,
      jobId: "reconcile-all-storage-daily",
      repeat: {
        cron: "0 3 * * *",
      },
    },
  );
};
