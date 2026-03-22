import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '../constants/env'

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
})

/**
 * Extracts the S3 key from a full storage URL.
 * e.g. "https://d1234.cloudfront.net/previews/gallery/photo.webp" -> "previews/gallery/photo.webp"
 */
function extractKeyFromUrl(storageUrl: string): string {
  const url = new URL(storageUrl)
  return url.pathname.replace(/^\//, '')
}

/**
 * Generates a presigned download URL for the given storage URL.
 * The SigLIP service uses this to fetch images from S3 without needing credentials.
 */
export async function getPresignedUrl(storageUrl: string, expiresIn = 300): Promise<string> {
  const key = extractKeyFromUrl(storageUrl)
  const command = new GetObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key: key,
  })
  return getSignedUrl(s3Client, command, { expiresIn })
}
