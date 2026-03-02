import type { Request, Response } from 'express'
import { z } from 'zod'
import { suggestAlbum, invalidateAlbumCache } from '../services/album.service'
import { logger } from '../utils/logger'

const SuggestAlbumSchema = z.object({
  userId: z.string().min(1),
  galleryId: z.string().min(1),
  prompt: z.string().min(1),
  albumSize: z.number().int().min(1).max(200).default(40),
  useLlm: z.boolean().optional().default(false),
})

const InvalidateCacheSchema = z.object({
  galleryId: z.string().min(1),
})

export async function suggestAlbumHandler(req: Request, res: Response): Promise<void> {
  try {
    const params = SuggestAlbumSchema.parse(req.body)

    const result = await suggestAlbum(params)

    res.status(200).json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request', details: error.issues })
      return
    }
    logger.error({ error }, 'Suggest album failed')
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function invalidateCacheHandler(req: Request, res: Response): Promise<void> {
  try {
    const { galleryId } = InvalidateCacheSchema.parse(req.body)

    await invalidateAlbumCache(galleryId)

    res.status(200).json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request', details: error.issues })
      return
    }
    logger.error({ error }, 'Invalidate cache failed')
    res.status(500).json({ error: 'Internal server error' })
  }
}
