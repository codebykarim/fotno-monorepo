import { Queue } from 'bullmq'
import { bullConnection } from './connection'

export interface GphotosImportJobData {
  jobId: string
}

export const gphotosImportQueue = new Queue<GphotosImportJobData>('gphotos-import', {
  connection: bullConnection,
  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: { count: 50 },
    removeOnFail: { count: 50 },
  },
})
