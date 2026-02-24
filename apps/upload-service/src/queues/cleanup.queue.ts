import { Queue } from 'bullmq'
import type { CleanupJobData } from '../interfaces/index'
import { bullConnection } from './connection'

export const cleanupQueue = new Queue<CleanupJobData>('upload-cleanup', {
  connection: bullConnection,
})

export async function registerCleanupRecurringJobs(): Promise<void> {
  await cleanupQueue.add('cleanup', {}, {
    repeat: { pattern: '0 * * * *' },
    jobId: 'cleanup-recurring',
  })

  await cleanupQueue.add('reconcile', {}, {
    repeat: { pattern: '0 3 * * *' },
    jobId: 'reconcile-recurring',
  })
}
