import { Router } from 'express'
import { prisma } from '@workspace/db'
import { env } from '../constants/env'
import { redis } from '../bootstrap'
import { processPhotoQueue } from '../queues/process-photo-queue'

const router = Router()

router.get('/', async (_req, res) => {
  const checks: Record<string, unknown> = {}

  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database = 'ok'
  } catch {
    checks.database = 'error'
  }

  try {
    await redis.ping()
    checks.redis = 'ok'
  } catch {
    checks.redis = 'error'
  }

  checks.s3 = env.AWS_S3_BUCKET ? 'ok' : 'not_configured'

  checks.queues = {
    processPhoto: await processPhotoQueue.getJobCounts(),
  }

  const hasError = Object.values(checks).some((value) => value === 'error')
  const status = hasError ? 'degraded' : 'ok'

  res.json({
    status,
    checks,
    uptime: process.uptime(),
    version: 'unknown',
  })
})

export default router
