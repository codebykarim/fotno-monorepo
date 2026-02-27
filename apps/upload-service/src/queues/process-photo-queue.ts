import { Queue } from 'bullmq'
import type { ProcessPhotoJobData } from '../interfaces/index'
import { bullConnection } from './connection'

/**
 * BullMQ queue for photo processing jobs. Each job is picked up by process-photo-worker,
 * which downloads the original, generates thumbnail + preview, uploads them, and updates the photo record.
 */
export const processPhotoQueue = new Queue<ProcessPhotoJobData>('process-photo', {
  connection: bullConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5_000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
})
