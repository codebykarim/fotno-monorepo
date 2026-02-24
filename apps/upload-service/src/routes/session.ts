import { Router } from 'express'
import { sessionController } from '../controllers/session'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

router.use(authMiddleware)
router.get('/:galleryId', (req, res, next) => {
  void sessionController.getGallerySession(req, res, next)
})

export default router
