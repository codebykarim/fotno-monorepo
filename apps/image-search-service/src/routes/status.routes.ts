import { Router } from 'express'
import type { Request, Response } from 'express'
import { getGalleryStatus } from '../services/status.service'
import { logger } from '../utils/logger'

const router = Router()

router.get('/gallery-status/:galleryId', async (req: Request, res: Response) => {
  try {
    const { galleryId } = req.params
    if (!galleryId) {
      res.status(400).json({ error: 'galleryId is required' })
      return
    }

    const status = await getGalleryStatus(galleryId)
    res.status(200).json(status)
  } catch (error) {
    logger.error({ error }, 'Failed to get gallery status')
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
