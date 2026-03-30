import { Worker } from 'bullmq'
import { randomUUID } from 'node:crypto'
import { prisma } from '@workspace/db'
import { OAuth2Client } from 'google-auth-library'
import type { GphotosImportJobData } from './gphotos-import-queue'
import { bullConnection } from './connection'
import { downloadPhotosItemToR2, fetchPickerBaseUrls } from '../services/gphotos-download'
import { storageService } from '../services/storage'
import { env } from '../constants/env'
import { logger } from '../utils/logger'

const workerLogger = logger.child({ module: 'gphotos-import.worker' })

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
  baseUrl: string,
) {
  const log = workerLogger.child({ itemId: item.id, mediaItemId: item.driveFileId })

  if (!item.driveFileId || !item.driveFileName) {
    await prisma.driveImportItem.update({
      where: { id: item.id },
      data: { status: 'SKIPPED', errorMessage: 'Missing media item ID or name' },
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

  await prisma.driveImportItem.update({
    where: { id: item.id },
    data: { status: 'DOWNLOADING' },
  })

  const photoId = randomUUID()
  const mimeType = item.driveMimeType ?? 'image/jpeg'
  const safeName = sanitizeFilename(item.driveFileName)
  const s3Key = `originals/${item.galleryId}/${photoId}/${safeName}`

  // Download from Google Photos Picker and upload to R2
  const { bytesWritten } = await downloadPhotosItemToR2(
    accessToken,
    baseUrl,
    s3Key,
    mimeType,
  )

  // Check storage quota with actual size
  const originalSize = BigInt(bytesWritten)
  const canUploadResult = await storageService.canUpload(userId, originalSize)
  if (!canUploadResult.allowed && !canUploadResult.isPaid) {
    log.warn({ bytesWritten }, 'Storage quota exceeded after download')
    await prisma.driveImportItem.update({
      where: { id: item.id },
      data: { status: 'SKIPPED', errorMessage: 'Storage quota exceeded' },
    })
    return 'SKIPPED' as const
  }

  // Get latest photo order
  const latestPhoto = await prisma.photo.findFirst({
    where: { galleryId: item.galleryId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })

  const order = (latestPhoto?.order ?? -1) + 1

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

  // Update item with actual size
  await prisma.driveImportItem.update({
    where: { id: item.id },
    data: { status: 'UPLOADED', photoId, driveFileSize: originalSize },
  })

  // Photo is status: "uploaded" — image-processor picks it up via DB polling

  await prisma.driveImportItem.update({
    where: { id: item.id },
    data: { status: 'PROCESSING' },
  })

  return 'COMPLETED' as const
}

export const gphotosImportWorker = new Worker<GphotosImportJobData>(
  'gphotos-import',
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
      log.error({ err: err.message }, 'Failed to get Google access token')
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

    // Initialize counters from already-processed items (handles retries)
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
        driveFolderId: true,
        driveFileId: true,
        driveFileName: true,
        driveFileSize: true,
        driveMimeType: true,
      },
    })

    // Fetch baseUrl map from the picker session
    // The sessionId is stored in driveFolderId
    const sessionId = items[0]?.driveFolderId
    let baseUrlMap = new Map<string, string>()

    if (sessionId) {
      try {
        baseUrlMap = await fetchPickerBaseUrls(accessToken, sessionId)
        log.info({ sessionId, count: baseUrlMap.size }, 'Fetched picker baseUrls')
      } catch (err: any) {
        log.error({ err: err.message }, 'Failed to fetch picker baseUrls')
        await prisma.driveImportJob.update({
          where: { id: jobId },
          data: {
            status: 'FAILED',
            errorMessage: `Failed to fetch photo URLs: ${err.message}`,
            completedAt: new Date(),
          },
        })
        return
      }
    }

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

      const results = await Promise.allSettled(
        chunk.map((item) => {
          const baseUrl = baseUrlMap.get(item.driveFileId ?? '')
          if (!baseUrl) {
            return prisma.driveImportItem
              .update({
                where: { id: item.id },
                data: { status: 'FAILED', errorMessage: 'No download URL found for this item' },
              })
              .then(() => 'SKIPPED' as const)
          }
          return processItem(item, userId, accessToken, baseUrl)
        }),
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
            { itemId: item?.id, err: result.reason?.message ?? result.reason },
            'Failed to process import item',
          )

          if (item) {
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
      failedFiles === items.length + completedFiles + skippedFiles
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
      'Google Photos import job finished',
    )
  },
  {
    connection: bullConnection,
    concurrency: 2,
  },
)

gphotosImportWorker.on('failed', async (job, err) => {
  if (!job) return

  workerLogger.error(
    { bullJobId: job.id, importJobId: job.data.jobId, err: err.message },
    'Google Photos import worker job permanently failed',
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
