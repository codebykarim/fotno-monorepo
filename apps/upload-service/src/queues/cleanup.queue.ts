import { Queue } from 'bullmq'
import type { CleanupJobData } from '../interfaces/index'
import { bullConnection } from './connection'

/**
 * BullMQ queue for upload-cleanup jobs: expires stale multipart sessions and reconciles storage.
 * Jobs run on a schedule via registerCleanupRecurringJobs.
 */
export const cleanupQueue = new Queue<CleanupJobData>('upload-cleanup', {
  connection: bullConnection,
})

/** Registers recurring jobs: cleanup (hourly) aborts expired sessions; reconcile (daily at 3am) fixes storage drift. */
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
