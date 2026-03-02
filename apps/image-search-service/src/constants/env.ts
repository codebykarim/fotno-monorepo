import { z } from 'zod'

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  IMAGE_SEARCH_SERVICE_PORT: z.string().optional(),
  JWT_SECRET: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  SIGLIP_SERVICE_URL: z.string().url().default('http://localhost:8001'),
  EMBEDDING_BATCH_SIZE: z.coerce.number().int().min(1).default(32),
  EMBEDDING_WORKER_CONCURRENCY: z.coerce.number().int().min(1).default(4),
})

const parsedEnv = EnvSchema.parse(process.env)

export const env = parsedEnv
