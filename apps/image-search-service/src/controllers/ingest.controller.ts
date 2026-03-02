import type { Request, Response } from 'express'
import { z } from 'zod'
import { upsertImageRecord, deleteImageRecord } from '../services/embedding.service'
import { enqueueEmbeddingJob } from '../queues/embedding.queue'
import { logger } from '../utils/logger'

const IngestPhotoSchema = z.object({
  photoId: z.string().min(1),
  userId: z.string().min(1),
  galleryId: z.string().min(1),
  storageUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional().nullable(),
  caption: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
})

const DeletePhotoSchema = z.object({
  photoId: z.string().min(1),
})

export async function ingestPhoto(req: Request, res: Response): Promise<void> {
  try {
    const payload = IngestPhotoSchema.parse(req.body)

    logger.info({ photoId: payload.photoId }, 'Ingesting photo')

    const id = await upsertImageRecord(payload)

    await enqueueEmbeddingJob()

    res.status(200).json({ success: true, id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request', details: error.issues })
      return
    }
    logger.error({ error }, 'Failed to ingest photo')
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function deletePhoto(req: Request, res: Response): Promise<void> {
  try {
    const { photoId } = DeletePhotoSchema.parse(req.body)

    logger.info({ photoId }, 'Deleting photo from search index')

    await deleteImageRecord(photoId)

    res.status(200).json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request', details: error.issues })
      return
    }
    logger.error({ error }, 'Failed to delete photo')
    res.status(500).json({ error: 'Internal server error' })
  }
}
