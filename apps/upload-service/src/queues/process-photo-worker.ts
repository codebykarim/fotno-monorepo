import { Worker } from 'bullmq'
import { prisma } from '@workspace/db'
import { PROCESSOR_CONCURRENCY } from '../constants/upload'
import { env } from '../constants/env'
import type { ProcessPhotoJobData } from '../interfaces/index'
import { imageService } from '../services/image'
import { storageService } from '../services/storage'
import { logger } from '../utils/logger'
import { bullConnection } from './connection'

const workerLogger = logger.child({ module: 'process-photo.worker' })

/**
 * BullMQ worker that processes upload-confirmed photos: downloads originals from S3, generates
 * thumbnail and preview via ImageService, uploads them, updates the photo record, and updates storage.
 * Concurrency is configurable via PROCESSOR_CONCURRENCY env var. Run multiple instances for scale.
 */
export const processPhotoWorker = new Worker<ProcessPhotoJobData>(
  'process-photo',
  async (job) => {
    const { photoId, userId, s3Key, s3Bucket } = job.data
    const log = workerLogger.child({ jobId: job.id, photoId, userId })

    const existing = await prisma.photo.findUnique({
      where: { id: photoId },
      select: {
        id: true,
        status: true,
        galleryId: true,
        mimeType: true,
        originalSize: true,
      },
    })

    if (!existing) {
      log.warn('Photo no longer exists, skipping')
      return
    }

    if (existing.status === 'processed') {
      log.info('Photo already processed, skipping duplicate job')
      return
    }

    await prisma.photo.update({
      where: { id: photoId },
      data: { status: 'processing' },
    })
    log.info('Processing started')

    const result = await imageService.processPhoto(
      photoId,
      existing.galleryId,
      s3Key,
      s3Bucket,
      existing.mimeType,
    )

    const totalSize = existing.originalSize + result.thumbnail.size + result.preview.size

    const updateResult = await prisma.photo.updateMany({
      where: {
        id: photoId,
        status: {
          not: 'processed',
        },
      },
      data: {
        status: 'processed',
        thumbnailKey: result.thumbnail.s3Key,
        previewKey: result.preview.s3Key,
        thumbnailSize: result.thumbnail.size,
        previewSize: result.preview.size,
        totalSize,
        width: result.preview.width,
        height: result.preview.height,
        blurDataUrl: result.blurDataUrl,
        processedAt: new Date(),
      },
    })

    if (updateResult.count === 0) {
      log.info('Photo already finalized by another worker instance')
      return
    }

    await storageService.addProcessedStorage(
      userId,
      photoId,
      result.thumbnail.size,
      result.preview.size,
    )

    // Ingest to image-search-service for embedding (with retries)
    if (env.AI_ENABLED) {
      const cfDomain = env.CLOUDFRONT_DOMAIN
      const publicUrl = cfDomain ? `https://${cfDomain}` : ''
      const storageUrl = `${publicUrl}/${result.preview.s3Key}`
      const ingestPayload = JSON.stringify({
        photoId,
        userId,
        galleryId: existing.galleryId,
        storageUrl,
        tags: [],
      })

      let ingested = false
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const res = await fetch(`${env.IMAGE_SEARCH_SERVICE_URL}/ingest-photo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: ingestPayload,
          })
          if (res.ok) {
            log.info({ photoId }, 'Ingested to search service')
            ingested = true
            break
          }
          log.warn({ photoId, status: res.status, attempt }, 'Search ingest returned non-OK')
        } catch (err: any) {
          log.warn({ photoId, err: err.message, attempt }, 'Search ingest request failed')
        }
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 1000 * attempt))
        }
      }

      if (!ingested) {
        log.error({ photoId }, 'Search ingest failed after 3 attempts — photo is processed but not searchable')
      }
    }

    log.info(
      {
        thumbnailSize: result.thumbnail.size.toString(),
        previewSize: result.preview.size.toString(),
      },
      'Processing complete',
    )
  },
  {
    connection: bullConnection,
    concurrency: PROCESSOR_CONCURRENCY,
  },
)

processPhotoWorker.on('failed', async (job, err) => {
  if (!job) {
    return
  }

  workerLogger.error(
    {
      jobId: job.id,
      photoId: job.data.photoId,
      err: err.message,
    },
    'Processing permanently failed',
  )

  await prisma.photo
    .update({
      where: { id: job.data.photoId },
      data: { status: 'failed' },
    })
    .catch(() => {
      // Photo may already be removed by user action.
    })
})
