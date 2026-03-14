import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { gdriveImportQueue } from '../queues/gdrive-import-queue'
import { gphotosImportQueue } from '../queues/gphotos-import-queue'
import { logger } from '../utils/logger'

const router = Router()
const log = logger.child({ module: 'import.routes' })

router.use(authMiddleware)

router.post('/gdrive-start', async (req, res, next) => {
  try {
    const { jobId } = req.body

    if (!jobId || typeof jobId !== 'string') {
      res.status(400).json({ error: 'jobId is required' })
      return
    }

    await gdriveImportQueue.add('gdrive-import', { jobId }, {
      jobId: `gdrive-import-${jobId}`,
    })

    log.info({ jobId }, 'Enqueued gdrive-import job')
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

router.post('/gphotos-start', async (req, res, next) => {
  try {
    const { jobId } = req.body

    if (!jobId || typeof jobId !== 'string') {
      res.status(400).json({ error: 'jobId is required' })
      return
    }

    await gphotosImportQueue.add('gphotos-import', { jobId }, {
      jobId: `gphotos-import-${jobId}`,
    })

    log.info({ jobId }, 'Enqueued gphotos-import job')
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

export default router
