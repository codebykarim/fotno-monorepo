import { Queue } from 'bullmq'
import { bullConnection } from './connection'

export interface GdriveImportJobData {
  jobId: string
}

export const gdriveImportQueue = new Queue<GdriveImportJobData>('gdrive-import', {
  connection: bullConnection,
  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: { count: 50 },
    removeOnFail: { count: 50 },
  },
})
