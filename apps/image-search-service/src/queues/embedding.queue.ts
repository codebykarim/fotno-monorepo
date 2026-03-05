import { Queue, Worker, Job } from 'bullmq'
import { env } from '../constants/env'
import { logger } from '../utils/logger'
import { processEmbeddingBatch } from '../services/embedding.service'
import { enqueueCaptioningJob } from './captioning.queue'

const QUEUE_NAME = 'embedding-queue'

const redisConnection = {
  host: new URL(env.REDIS_URL).hostname,
  port: parseInt(new URL(env.REDIS_URL).port || '6379', 10),
  maxRetriesPerRequest: null,
}

let queue: Queue | null = null
let worker: Worker | null = null

export function getEmbeddingQueue(): Queue {
  if (!queue) {
    queue = new Queue(QUEUE_NAME, { connection: redisConnection })
  }
  return queue
}

export async function enqueueEmbeddingJob(): Promise<void> {
  const q = getEmbeddingQueue()
  await q.add('process-batch', {}, { removeOnComplete: true, removeOnFail: 100 })
  logger.debug('Enqueued embedding job')
}

async function processJob(job: Job): Promise<void> {
  logger.info({ jobId: job.id }, 'Processing embedding job')

  let totalProcessed = 0
  const allGalleryIds = new Set<string>()
  let batchCount: number

  do {
    const result = await processEmbeddingBatch(env.EMBEDDING_BATCH_SIZE)
    batchCount = result.count
    totalProcessed += batchCount
    for (const gid of result.galleryIds) {
      allGalleryIds.add(gid)
    }
  } while (batchCount === env.EMBEDDING_BATCH_SIZE)

  // Enqueue captioning for each affected gallery
  for (const galleryId of allGalleryIds) {
    await enqueueCaptioningJob(galleryId)
  }

  logger.info({ jobId: job.id, totalProcessed, galleries: allGalleryIds.size }, 'Embedding job complete')
}

export function startEmbeddingWorker(): void {
  worker = new Worker(QUEUE_NAME, processJob, {
    connection: redisConnection,
    concurrency: env.EMBEDDING_WORKER_CONCURRENCY,
  })

  worker.on('completed', (job) => {
    logger.info({ jobId: job.id }, 'Embedding job completed')
  })

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Embedding job failed')
  })

  logger.info('Embedding worker started')
}

export async function stopEmbeddingWorker(): Promise<void> {
  if (worker) {
    await worker.close()
    worker = null
  }
  if (queue) {
    await queue.close()
    queue = null
  }
  logger.info('Embedding worker stopped')
}
