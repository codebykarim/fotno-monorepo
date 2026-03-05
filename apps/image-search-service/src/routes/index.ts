import { Router } from 'express'
import healthRoutes from './health.routes'
import ingestRoutes from './ingest.routes'
import searchRoutes from './search.routes'
import albumRoutes from './album.routes'
import captioningRoutes from './captioning.routes'
import statusRoutes from './status.routes'

const router = Router()

router.use(healthRoutes)
router.use(ingestRoutes)
router.use(searchRoutes)
router.use(albumRoutes)
router.use(captioningRoutes)
router.use(statusRoutes)

export default router
