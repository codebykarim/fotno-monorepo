import { z } from 'zod'

/**
 * Validates and provides typed access to all environment variables for the upload-service.
 * Each variable documents its purpose and effect on upload/processing behavior.
 */
const AwsRegionSchema = z.string().min(1)

const EnvSchema = z.object({
  /** Node environment: development, test, or production. Affects logging and error handling. */
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  /** Port the upload-service HTTP server listens on. Defaults to 4001 if unset. */
  UPLOAD_SERVICE_PORT: z.string().optional(),
  /** Shared secret for signing JWTs when the backend calls this service. Must match backend. */
  JWT_SECRET: z.string().min(1),
  /** AWS region for S3/R2 (e.g. us-east-1). Use "auto" for Cloudflare R2. */
  AWS_REGION: AwsRegionSchema,
  /** S3/R2 bucket name where originals, thumbnails, and previews are stored. */
  AWS_S3_BUCKET: z.string().min(1),
  /** Custom S3-compatible endpoint (e.g. R2). Omitted when using real AWS S3. */
  AWS_S3_ENDPOINT: z.string().url().optional(),
  /** Cloudflare R2 endpoint URL. Alternative to AWS_S3_ENDPOINT. */
  R2_ENDPOINT: z.string().url().optional(),
  /** AWS/R2 access key ID. Optional if using instance/role credentials. */
  AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
  /** AWS/R2 secret access key. Optional if using instance/role credentials. */
  AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  /** Redis connection URL for BullMQ job queues (process-photo, cleanup, session state). */
  REDIS_URL: z.string().min(1),
  /** Public URL of the dashboard app. Used for email links and CORS if needed. */
  NEXT_PUBLIC_DASHBOARD_URL: z.string().url().optional(),

  /** How many photos a single worker processes in parallel. Increase for higher throughput; scale with CPU. Default 8. */
  PROCESSOR_CONCURRENCY: z.coerce.number().int().min(1).default(8),
  /** Max number of files in one batch-init request. Clients should chunk large batches. Default 500. */
  MAX_FILES_PER_BATCH: z.coerce.number().int().min(1).default(500),
  /** Max size in bytes for a single uploaded file. Default 500 MB. */
  MAX_FILE_SIZE_BYTES: z.coerce.number().int().min(1).default(500 * 1024 * 1024),
  /** Multipart chunk size in bytes. Larger chunks = fewer presigned URLs but bigger network payloads. Default 10 MB. */
  CHUNK_SIZE_BYTES: z.coerce.number().int().min(1).default(10 * 1024 * 1024),
  /** Hours until an incomplete multipart upload session expires. Expired sessions are aborted and cleaned up. Default 24. */
  UPLOAD_SESSION_TTL_HRS: z.coerce.number().min(1).default(24),
  /** Validity of presigned upload URLs in seconds. Client must complete upload before this expires. Default 7200 (2h). */
  PRESIGNED_URL_TTL_SEC: z.coerce.number().int().min(60).default(7200),
})

const parsedEnv = EnvSchema.parse(process.env)

const resolvedS3Endpoint = parsedEnv.AWS_S3_ENDPOINT ?? parsedEnv.R2_ENDPOINT
const looksLikeAwsRegion = /^[a-z]{2}-[a-z]+-\d+$/.test(parsedEnv.AWS_REGION)

if (!resolvedS3Endpoint && !looksLikeAwsRegion) {
  throw new Error(
    'AWS_S3_ENDPOINT (or R2_ENDPOINT) is required when AWS_REGION is not a standard AWS region.',
  )
}

export const env = {
  ...parsedEnv,
  AWS_S3_ENDPOINT: resolvedS3Endpoint,
}
