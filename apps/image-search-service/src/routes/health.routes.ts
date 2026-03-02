import { Router } from 'express'
import { getPool } from '../utils/db'
import { healthCheck as siglipHealthCheck } from '../services/siglip.client'
import { logger } from '../utils/logger'

const router = Router()

router.get('/health', async (_req, res) => {
  try {
    const pool = await getPool()
    await pool.query('SELECT 1')

    const siglipHealthy = await siglipHealthCheck()

    res.json({
      status: 'healthy',
      database: 'connected',
      siglip: siglipHealthy ? 'connected' : 'unavailable',
    })
  } catch (error) {
    logger.error({ error }, 'Health check failed')
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      siglip: 'unknown',
    })
  }
})

export default router
