import Bull, { JobOptions, Queue } from "bull";

export type ProcessPhotoJobData = {
  photoId: string;
};

export type AiAnalyzePhotoJobData = {
  photoId: string;
};

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("Missing REDIS_URL environment variable");
}

/**
 * Primary queue for photo processing jobs.
 */
export const photoQueue: Queue<ProcessPhotoJobData> = new Bull(
  "photo-processing",
  redisUrl
);

/**
 * Queue used by downstream AI analysis phase.
 */
export const aiQueue: Queue<AiAnalyzePhotoJobData> = new Bull(
  "photo-ai-analysis",
  redisUrl
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
 * Enqueues a process-photo background job.
 */
export const enqueueProcessPhoto = async (photoId: string): Promise<void> => {
  await photoQueue.add("process-photo", { photoId }, defaultJobOptions);
};

/**
 * Enqueues an ai-analyze-photo background job.
 */
export const enqueueAiAnalyzePhoto = async (photoId: string): Promise<void> => {
  await aiQueue.add("ai-analyze-photo", { photoId }, defaultJobOptions);
};
