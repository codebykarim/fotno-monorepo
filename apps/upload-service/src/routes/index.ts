import { Router } from 'express'
import healthRoutes from './health'
import sessionRoutes from './session'
import uploadRoutes from './upload'

const router = Router()

router.use('/api/upload', uploadRoutes)
router.use('/api/upload/session', sessionRoutes)
router.use('/health', healthRoutes)

export default router
