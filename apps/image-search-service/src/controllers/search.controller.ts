import type { Request, Response } from 'express'
import { z } from 'zod'
import { searchPhotos } from '../services/search.service'
import { logger } from '../utils/logger'

const SearchSchema = z.object({
  userId: z.string().min(1),
  galleryId: z.string().min(1),
  prompt: z.string().min(1),
  limit: z.number().int().min(1).max(500).default(50),
})

export async function search(req: Request, res: Response): Promise<void> {
  try {
    const params = SearchSchema.parse(req.body)

    const results = await searchPhotos(params)

    res.status(200).json({
      photoIds: results.map((r) => r.photoId),
      scores: results.map((r) => r.score),
      results,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request', details: error.issues })
      return
    }
    logger.error({ error }, 'Search failed')
    res.status(500).json({ error: 'Internal server error' })
  }
}
