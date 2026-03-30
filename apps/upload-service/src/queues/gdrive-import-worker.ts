import { Worker } from 'bullmq'
import { randomUUID } from 'node:crypto'
import { prisma } from '@workspace/db'
import { OAuth2Client } from 'google-auth-library'
import type { GdriveImportJobData } from './gdrive-import-queue'
import { bullConnection } from './connection'
import { downloadDriveFileToR2 } from '../services/gdrive-download'
import { storageService } from '../services/storage'
import { env } from '../constants/env'
import { logger } from '../utils/logger'

const workerLogger = logger.child({ module: 'gdrive-import.worker' })

const CONCURRENCY_LIMIT = 3

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_')
}

async function refreshAccessToken(userId: string): Promise<string> {
  const account = await prisma.account.findFirst({
    where: { userId, providerId: 'google' },
    select: {
      id: true,
      accessToken: true,
      refreshToken: true,
      accessTokenExpiresAt: true,
    },
  })

  if (!account) throw new Error('No Google account linked')

  const now = new Date()
  const expiresAt = account.accessTokenExpiresAt
  const isExpired = !expiresAt || expiresAt.getTime() - now.getTime() < 60_000

  if (!isExpired && account.accessToken) {
    return account.accessToken
  }

  if (!account.refreshToken) {
    throw new Error('No refresh token available')
  }

  const clientId = env.GOOGLE_CLIENT_ID
  const clientSecret = env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID/SECRET not configured on upload-service')
  }

  const client = new OAuth2Client(clientId, clientSecret)
  client.setCredentials({ refresh_token: account.refreshToken })
  const { credentials } = await client.refreshAccessToken()

  await prisma.account.update({
    where: { id: account.id },
    data: {
      accessToken: credentials.access_token ?? account.accessToken,
      accessTokenExpiresAt: credentials.expiry_date
        ? new Date(credentials.expiry_date)
        : undefined,
      ...(credentials.refresh_token
        ? { refreshToken: credentials.refresh_token }
        : {}),
    },
  })

  if (!credentials.access_token) {
    throw new Error('Failed to refresh access token')
  }

  return credentials.access_token
}

async function processItem(
  item: {
    id: string
    galleryId: string
    driveFileId: string | null
    driveFileName: string | null
    driveFileSize: bigint
    driveMimeType: string | null
  },
  userId: string,
  accessToken: string,
  jobId: string,
) {
  const log = workerLogger.child({ itemId: item.id, driveFileId: item.driveFileId })

  if (!item.driveFileId || !item.driveFileName) {
    await prisma.driveImportItem.update({
      where: { id: item.id },
      data: { status: 'SKIPPED', errorMessage: 'Missing file ID or name' },
    })
    return 'SKIPPED' as const
  }

  // Check for duplicate by original filename in target gallery
  const existing = await prisma.photo.findFirst({
    where: {
      galleryId: item.galleryId,
      originalFilename: item.driveFileName,
    },
    select: { id: true },
  })

  if (existing) {
    await prisma.driveImportItem.update({
      where: { id: item.id },
      data: { status: 'SKIPPED', errorMessage: 'Duplicate filename in gallery', photoId: existing.id },
    })
    return 'SKIPPED' as const
  }

  // Check storage quota
  const canUploadResult = await storageService.canUpload(userId, item.driveFileSize)
  if (!canUploadResult.allowed && !canUploadResult.isPaid) {
    await prisma.driveImportItem.update({
      where: { id: item.id },
      data: { status: 'SKIPPED', errorMessage: 'Storage quota exceeded' },
    })
    return 'SKIPPED' as const
  }

  await prisma.driveImportItem.update({
    where: { id: item.id },
    data: { status: 'DOWNLOADING' },
  })

  const photoId = randomUUID()
  const mimeType = item.driveMimeType ?? 'image/jpeg'
  const safeName = sanitizeFilename(item.driveFileName)
  const s3Key = `originals/${item.galleryId}/${photoId}/${safeName}`

  // Download from Drive and upload to R2
  const { bytesWritten } = await downloadDriveFileToR2(
    accessToken,
    item.driveFileId,
    s3Key,
    mimeType,
    Number(item.driveFileSize),
  )

  // Get latest photo order
  const latestPhoto = await prisma.photo.findFirst({
    where: { galleryId: item.galleryId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })

  const order = (latestPhoto?.order ?? -1) + 1
  const originalSize = BigInt(bytesWritten)

  // Create Photo record
  await prisma.photo.create({
    data: {
      id: photoId,
      galleryId: item.galleryId,
      s3Key,
      s3Bucket: env.AWS_S3_BUCKET,
      originalFilename: item.driveFileName,
      mimeType,
      originalSize,
      status: 'uploaded',
      order,
    },
  })

  // Reserve + confirm storage
  await storageService.reserveStorage(userId, originalSize)
  await storageService.confirmReservation(userId, photoId, originalSize)

  await prisma.driveImportItem.update({
    where: { id: item.id },
    data: { status: 'UPLOADED', photoId },
  })

  // Photo is status: "uploaded" — image-processor picks it up via DB polling

  await prisma.driveImportItem.update({
    where: { id: item.id },
    data: { status: 'PROCESSING' },
  })

  return 'COMPLETED' as const
}

export const gdriveImportWorker = new Worker<GdriveImportJobData>(
  'gdrive-import',
  async (job) => {
    const { jobId } = job.data
    const log = workerLogger.child({ bullJobId: job.id, importJobId: jobId })

    const importJob = await prisma.driveImportJob.findUnique({
      where: { id: jobId },
      select: { id: true, userId: true, status: true },
    })

    if (!importJob) {
      log.warn('Import job not found, skipping')
      return
    }

    if (importJob.status === 'CANCELLED') {
      log.info('Import job was cancelled before processing started')
      return
    }

    const userId = importJob.userId

    await prisma.driveImportJob.update({
      where: { id: jobId },
      data: { status: 'IN_PROGRESS', startedAt: new Date() },
    })

    let accessToken: string
    try {
      accessToken = await refreshAccessToken(userId)
    } catch (err: any) {
      log.error({ err: err.message }, 'Failed to get Drive access token')
      await prisma.driveImportJob.update({
        where: { id: jobId },
        data: {
          status: 'FAILED',
          errorMessage: `Auth error: ${err.message}`,
          completedAt: new Date(),
        },
      })
      return
    }

    // Reset items stuck in DOWNLOADING from a previous crashed run
    await prisma.driveImportItem.updateMany({
      where: { jobId, status: 'DOWNLOADING' },
      data: { status: 'PENDING' },
    })

    // Initialize counters from already-processed items (handles retries correctly)
    const alreadyCounts = await prisma.driveImportItem.groupBy({
      by: ['status'],
      where: { jobId, status: { notIn: ['PENDING', 'DOWNLOADING'] } },
      _count: true,
    })

    let completedFiles = 0
    let failedFiles = 0
    let skippedFiles = 0

    for (const group of alreadyCounts) {
      if (['UPLOADED', 'PROCESSING', 'COMPLETED'].includes(group.status)) {
        completedFiles += group._count
      } else if (group.status === 'FAILED') {
        failedFiles += group._count
      } else if (group.status === 'SKIPPED') {
        skippedFiles += group._count
      }
    }

    if (completedFiles + failedFiles + skippedFiles > 0) {
      log.info(
        { completedFiles, failedFiles, skippedFiles },
        'Resuming with counts from previous run',
      )
    }

    const items = await prisma.driveImportItem.findMany({
      where: { jobId, status: 'PENDING' },
      select: {
        id: true,
        galleryId: true,
        driveFileId: true,
        driveFileName: true,
        driveFileSize: true,
        driveMimeType: true,
      },
    })

    // Process items with concurrency limit
    const chunks: typeof items[] = []
    for (let i = 0; i < items.length; i += CONCURRENCY_LIMIT) {
      chunks.push(items.slice(i, i + CONCURRENCY_LIMIT))
    }

    for (const chunk of chunks) {
      // Check for cancellation before each batch
      const currentJob = await prisma.driveImportJob.findUnique({
        where: { id: jobId },
        select: { status: true },
      })

      if (currentJob?.status === 'CANCELLED') {
        log.info('Import job cancelled, stopping')
        break
      }

      // Refresh token periodically
      try {
        accessToken = await refreshAccessToken(userId)
      } catch (err: any) {
        log.warn({ err: err.message }, 'Token refresh failed mid-import, trying with existing token')
      }

      const results = await Promise.allSettled(
        chunk.map((item) => processItem(item, userId, accessToken, jobId)),
      )

      for (const [idx, result] of results.entries()) {
        if (result.status === 'fulfilled') {
          if (result.value === 'COMPLETED') {
            completedFiles++
          } else {
            skippedFiles++
          }
        } else {
          failedFiles++
          const item = chunk[idx]
          log.error(
            { itemId: item.id, err: result.reason?.message ?? result.reason },
            'Failed to process import item',
          )

          await prisma.driveImportItem
            .update({
              where: { id: item.id },
              data: {
                status: 'FAILED',
                errorMessage: result.reason?.message ?? 'Unknown error',
              },
            })
            .catch(() => {})
        }

        // Update counters
        await prisma.driveImportJob
          .update({
            where: { id: jobId },
            data: { completedFiles, failedFiles, skippedFiles },
          })
          .catch(() => {})
      }
    }

    const finalStatus =
      failedFiles === items.length
        ? 'FAILED'
        : 'COMPLETED'

    // Recheck in case it was cancelled
    const finalJob = await prisma.driveImportJob.findUnique({
      where: { id: jobId },
      select: { status: true },
    })

    if (finalJob?.status !== 'CANCELLED') {
      await prisma.driveImportJob.update({
        where: { id: jobId },
        data: {
          status: finalStatus as any,
          completedFiles,
          failedFiles,
          skippedFiles,
          completedAt: new Date(),
        },
      })
    }

    log.info(
      { completedFiles, failedFiles, skippedFiles, total: items.length },
      'Import job finished',
    )
  },
  {
    connection: bullConnection,
    concurrency: 2,
  },
)

gdriveImportWorker.on('failed', async (job, err) => {
  if (!job) return

  workerLogger.error(
    { bullJobId: job.id, importJobId: job.data.jobId, err: err.message },
    'Import worker job permanently failed',
  )

  await prisma.driveImportJob
    .update({
      where: { id: job.data.jobId },
      data: {
        status: 'FAILED',
        errorMessage: err.message,
        completedAt: new Date(),
      },
    })
    .catch(() => {})
})
