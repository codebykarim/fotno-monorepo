import { z } from 'zod'

const AwsRegionSchema = z.string().min(1)

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  UPLOAD_SERVICE_PORT: z.string().optional(),
  JWT_SECRET: z.string().min(1),
  AWS_REGION: AwsRegionSchema,
  AWS_S3_BUCKET: z.string().min(1),
  AWS_S3_ENDPOINT: z.string().url().optional(),
  R2_ENDPOINT: z.string().url().optional(),
  AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
  AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  REDIS_URL: z.string().min(1),
  NEXT_PUBLIC_DASHBOARD_URL: z.string().url().optional(),
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
