import { Router } from 'express'
import { suggestAlbumHandler, invalidateCacheHandler } from '../controllers/album.controller'

const router = Router()

router.post('/suggest-album', suggestAlbumHandler)
router.post('/invalidate-cache', invalidateCacheHandler)

export default router
