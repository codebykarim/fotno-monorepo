import { Router } from 'express'
import { captionBackfill, captionLibraryStats } from '../controllers/captioning.controller'

const router = Router()

router.post('/caption-backfill', captionBackfill)
router.get('/caption-library/stats', captionLibraryStats)

export default router
