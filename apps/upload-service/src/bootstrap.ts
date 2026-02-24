import { Redis } from 'ioredis'
import { prisma } from '@workspace/db'
import { env } from './constants/env'
import { logger } from './utils/logger'

export let redis: Redis

let processPhotoWorkerRef: { close: () => Promise<void> } | null = null
let cleanupWorkerRef: { close: () => Promise<void> } | null = null

async function assertRedisAvailable(redisUrl: string): Promise<void> {
  const probe = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    retryStrategy: () => null,
    connectTimeout: 5_000,
  })
  probe.on('error', () => {})

  try {
    await probe.connect()
    await probe.ping()
  } catch (error) {
    logger.error({ err: error, redisUrl }, 'Redis startup connectivity check failed')
    throw new Error(
      `Failed to connect to Redis at ${redisUrl}. Start Redis or update REDIS_URL.`,
    )
  } finally {
    probe.disconnect()
  }
}

export async function bootstrap(): Promise<void> {
  logger.info('Bootstrapping upload-service...')

  await assertRedisAvailable(env.REDIS_URL)

  redis = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null })
  await redis.ping()
  redis.on('error', (err: Error) => logger.error({ err }, 'Redis error'))
  logger.info('Redis connected')

  await prisma.$connect()
  logger.info('Database connected')

  const { processPhotoWorker } = await import('./queues/process-photo-worker')
  const { cleanupWorker } = await import('./queues/cleanup.worker')

  processPhotoWorkerRef = processPhotoWorker
  cleanupWorkerRef = cleanupWorker

  const { registerCleanupRecurringJobs } = await import('./queues/cleanup.queue')
  await registerCleanupRecurringJobs()

  logger.info('Workers started')
}

export async function gracefulShutdown(): Promise<void> {
  logger.info('Shutting down gracefully...')

  await processPhotoWorkerRef?.close().catch(() => {})
  await cleanupWorkerRef?.close().catch(() => {})

  await prisma.$disconnect().catch(() => {})

  if (redis) {
    await redis.quit().catch(() => {})
  }

  process.exit(0)
}
