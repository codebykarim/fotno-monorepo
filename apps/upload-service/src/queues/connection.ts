import { env } from '../constants/env'

const redisUrl = new URL(env.REDIS_URL)

const dbPath = redisUrl.pathname.replace('/', '')

export const bullConnection = {
  host: redisUrl.hostname,
  port: redisUrl.port.length > 0 ? Number(redisUrl.port) : 6379,
  username: redisUrl.username.length > 0 ? decodeURIComponent(redisUrl.username) : undefined,
  password: redisUrl.password.length > 0 ? decodeURIComponent(redisUrl.password) : undefined,
  db: dbPath.length > 0 ? Number(dbPath) : undefined,
  tls: redisUrl.protocol === 'rediss:' ? {} : undefined,
  maxRetriesPerRequest: null,
}
