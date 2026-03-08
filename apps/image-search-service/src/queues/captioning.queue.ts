import { Queue, Worker, Job } from 'bullmq'
import { env } from '../constants/env'
import { logger } from '../utils/logger'
import { processCaptioning } from '../services/captioning.service'

const QUEUE_NAME = 'captioning-queue'

const redisUrl = new URL(env.REDIS_URL)
const redisConnection = {
  host: redisUrl.hostname,
  port: parseInt(redisUrl.port || '6379', 10),
  password: redisUrl.password || undefined,
  username: redisUrl.username || undefined,
  maxRetriesPerRequest: null,
}

let queue: Queue | null = null
let worker: Worker | null = null

function getCaptioningQueue(): Queue {
  if (!queue) {
    queue = new Queue(QUEUE_NAME, { connection: redisConnection })
  }
  return queue
}

export async function enqueueCaptioningJob(galleryId: string): Promise<void> {
  if (!env.CAPTIONING_ENABLED) {
    logger.debug({ galleryId }, 'Captioning disabled, skipping')
    return
  }

  const q = getCaptioningQueue()
  await q.add(
    'caption-gallery',
    { galleryId },
    {
      delay: 30_000,
      jobId: `caption-${galleryId}`,
      removeOnComplete: true,
      removeOnFail: 100,
    }
  )
  logger.debug({ galleryId }, 'Enqueued captioning job')
}

async function processJob(job: Job<{ galleryId: string }>): Promise<void> {
  const { galleryId } = job.data
  logger.info({ jobId: job.id, galleryId }, 'Processing captioning job')

  const stats = await processCaptioning(galleryId)

  logger.info({ jobId: job.id, ...stats }, 'Captioning job complete')
}

export function startCaptioningWorker(): void {
  if (!env.CAPTIONING_ENABLED) {
    logger.info('Captioning disabled, worker not started')
    return
  }

  worker = new Worker(QUEUE_NAME, processJob, {
    connection: redisConnection,
    concurrency: env.CAPTIONING_WORKER_CONCURRENCY,
  })

  worker.on('completed', (job) => {
    logger.info({ jobId: job.id }, 'Captioning job completed')
  })

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Captioning job failed')
  })

  logger.info('Captioning worker started')
}

export async function stopCaptioningWorker(): Promise<void> {
  if (worker) {
    await worker.close()
    worker = null
  }
  if (queue) {
    await queue.close()
    queue = null
  }
  logger.info('Captioning worker stopped')
}
