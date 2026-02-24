import { Worker } from 'bullmq'
import { prisma } from '@workspace/db'
import type { CleanupJobData } from '../interfaces/index'
import { multipartService } from '../services/multipart'
import { storageService } from '../services/storage'
import { logger } from '../utils/logger'
import { bullConnection } from './connection'

const workerLogger = logger.child({ module: 'cleanup.worker' })

async function cleanupExpiredSessions(batchSize: number): Promise<void> {
  const now = new Date()
  const sessions = await prisma.uploadSession.findMany({
    where: {
      status: 'IN_PROGRESS',
      expiresAt: {
        lt: now,
      },
    },
    take: batchSize,
    include: {
      photo: {
        select: {
          id: true,
          status: true,
          gallery: {
            select: {
              userId: true,
            },
          },
        },
      },
    },
  })

  const results = await Promise.allSettled(
    sessions.map(async (session) => {
      await multipartService.abortUpload(session.s3Key, session.s3UploadId)

      const state = await prisma.$transaction(async (tx) => {
        const current = await tx.uploadSession.findUnique({
          where: { id: session.id },
          select: {
            id: true,
            status: true,
          },
        })

        if (!current || current.status !== 'IN_PROGRESS') {
          return { changed: false }
        }

        await tx.uploadSession.update({
          where: { id: session.id },
          data: { status: 'EXPIRED' },
        })

        if (session.photo.status === 'pending') {
          await tx.photo.delete({
            where: { id: session.photo.id },
          })
        }

        return {
          changed: true,
        }
      })

      if (state.changed) {
        await storageService.releaseReservation(
          session.photo.gallery.userId,
          session.totalSize,
        )
      }
    }),
  )

  const failedCount = results.filter((result) => result.status === 'rejected').length
  workerLogger.info(
    {
      total: sessions.length,
      failed: failedCount,
      cleaned: sessions.length - failedCount,
    },
    'Expired upload cleanup completed',
  )
}

async function reconcileStorageForUsers(): Promise<void> {
  const rows = await prisma.$queryRaw<Array<{ userId: string }>>`
    SELECT DISTINCT g."userId"
    FROM "photo" p
    JOIN "gallery" g ON g."id" = p."galleryId"
  `

  const withDrift: Array<{ userId: string; delta: string }> = []

  for (const row of rows) {
    const result = await storageService.reconcile(row.userId)
    if (result.delta !== 0n) {
      withDrift.push({ userId: row.userId, delta: result.delta.toString() })
    }
  }

  workerLogger.info(
    {
      usersChecked: rows.length,
      usersWithDrift: withDrift.length,
      drift: withDrift,
    },
    'Storage reconciliation completed',
  )
}

export const cleanupWorker = new Worker<CleanupJobData>(
  'upload-cleanup',
  async (job) => {
    if (job.name === 'cleanup') {
      const batchSize = Math.max(1, job.data.batchSize ?? 100)
      await cleanupExpiredSessions(batchSize)
      return
    }

    if (job.name === 'reconcile') {
      await reconcileStorageForUsers()
    }
  },
  {
    connection: bullConnection,
    concurrency: 1,
  },
)
