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
  AWS_S3_ENDPOINT: z.string().min(1),
  AWS_REGION: z.string().default('auto'),
  AWS_S3_BUCKET: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  QWEN_SERVICE_URL: z.string().url().default('http://localhost:8002'),
  CAPTIONING_BATCH_SIZE: z.coerce.number().int().min(1).default(20),
  CAPTIONING_WORKER_CONCURRENCY: z.coerce.number().int().min(1).default(2),
  CAPTION_LIBRARY_SIMILARITY_THRESHOLD: z.coerce.number().min(0).max(1).default(0.92),
  CAPTION_CLUSTER_THRESHOLD: z.coerce.number().min(0).max(1).default(0.93),
  CAPTIONING_ENABLED: z
    .string()
    .default('true')
    .transform((v) => v === 'true'),
  OPENAI_API_KEY: z.string().min(1).optional(),
})

const parsedEnv = EnvSchema.parse(process.env)

export const env = parsedEnv
