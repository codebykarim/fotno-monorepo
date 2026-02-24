import './load-env'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { bootstrap, gracefulShutdown } from './bootstrap'
import { env } from './constants/env'
import { errorMiddleware } from './middleware/error.middleware'
import router from './routes/index'
import { logger } from './utils/logger'

const app = express()
const PORT = Number(env.UPLOAD_SERVICE_PORT ?? 4001)

app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.use(router)
app.use(errorMiddleware)

bootstrap()
  .then(() => {
    app.listen(PORT, () => logger.info({ port: PORT }, 'Upload service listening'))
  })
  .catch((err) => {
    logger.fatal({ err }, 'Bootstrap failed - exiting')
    process.exit(1)
  })

process.on('SIGTERM', () => {
  void gracefulShutdown()
})
process.on('SIGINT', () => {
  void gracefulShutdown()
})
