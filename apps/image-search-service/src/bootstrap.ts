import { getPool, closePool } from './utils/db'
import { startEmbeddingWorker, stopEmbeddingWorker } from './queues/embedding.queue'
import { startCaptioningWorker, stopCaptioningWorker } from './queues/captioning.queue'
import { logger } from './utils/logger'

export async function bootstrap(): Promise<void> {
  logger.info('Bootstrapping image-search-service...')

  // Initialize database connection
  await getPool()

  // Start workers
  startEmbeddingWorker()
  startCaptioningWorker()

  logger.info('Bootstrap complete')
}

export async function gracefulShutdown(): Promise<void> {
  logger.info('Graceful shutdown initiated...')

  await stopCaptioningWorker()
  await stopEmbeddingWorker()
  await closePool()

  logger.info('Shutdown complete')
  process.exit(0)
}
