import { Router } from 'express'
import { uploadController } from '../controllers/upload'
import { authMiddleware } from '../middleware/auth.middleware'
import { storageGuardMiddleware } from '../middleware/storage-guard.middleware'

const router = Router()

router.use(authMiddleware)

router.post('/batch-init', storageGuardMiddleware, (req, res, next) => {
  void uploadController.batchInit(req, res, next)
})
router.patch('/part-complete', (req, res, next) => {
  void uploadController.partComplete(req, res, next)
})
router.post('/confirm', (req, res, next) => {
  void uploadController.confirm(req, res, next)
})
router.post('/abort', (req, res, next) => {
  void uploadController.abort(req, res, next)
})

export default router
