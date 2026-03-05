import type { Request, Response } from 'express'
import { z } from 'zod'
import { enqueueCaptioningJob } from '../queues/captioning.queue'
import { getLibraryStats } from '../services/caption-library.service'
import { query } from '../utils/db'
import { logger } from '../utils/logger'

const BackfillSchema = z.object({
  galleryId: z.string().min(1),
  force: z.boolean().default(false),
})

export async function captionBackfill(req: Request, res: Response): Promise<void> {
  try {
    const { galleryId, force } = BackfillSchema.parse(req.body)

    if (force) {
      // Clear existing captions so they get re-processed
      await query(
        `UPDATE image_search_image
        SET caption = NULL, tags = '{}', "captionedAt" = NULL, "captionSource" = NULL, "updatedAt" = NOW()
        WHERE "galleryId" = $1`,
        [galleryId]
      )
      logger.info({ galleryId }, 'Cleared existing captions for force re-captioning')
    }

    logger.info({ galleryId, force }, 'Triggering caption backfill')

    await enqueueCaptioningJob(galleryId)

    res.status(200).json({ success: true, message: `Captioning queued for gallery ${galleryId}` })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request', details: error.issues })
      return
    }
    logger.error({ error }, 'Failed to trigger caption backfill')
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function captionLibraryStats(_req: Request, res: Response): Promise<void> {
  try {
    const stats = await getLibraryStats()
    res.status(200).json(stats)
  } catch (error) {
    logger.error({ error }, 'Failed to get caption library stats')
    res.status(500).json({ error: 'Internal server error' })
  }
}
