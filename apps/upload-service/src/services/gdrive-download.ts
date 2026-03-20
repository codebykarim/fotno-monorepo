import { PutObjectCommand, S3Client, type S3ClientConfig } from '@aws-sdk/client-s3'
import { env } from '../constants/env'
import { logger } from '../utils/logger'

const log = logger.child({ module: 'gdrive-download' })

const FIFTY_MB = 50 * 1024 * 1024

function getS3Client(): S3Client {
  const config: S3ClientConfig = {
    region: env.AWS_REGION,
    ...(env.AWS_S3_ENDPOINT ? { endpoint: env.AWS_S3_ENDPOINT } : {}),
    forcePathStyle: Boolean(env.AWS_S3_ENDPOINT),
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  }

  if (env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY) {
    config.credentials = {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    }
  }

  return new S3Client(config)
}

const s3 = getS3Client()

export async function downloadDriveFileToR2(
  accessToken: string,
  driveFileId: string,
  s3Key: string,
  mimeType: string,
  expectedSize: number,
): Promise<{ bytesWritten: number }> {
  const driveUrl = `https://www.googleapis.com/drive/v3/files/${driveFileId}?alt=media`

  const driveRes = await fetch(driveUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!driveRes.ok) {
    const text = await driveRes.text()
    throw new Error(`Drive download failed (${driveRes.status}): ${text}`)
  }

  const buffer = Buffer.from(await driveRes.arrayBuffer())
  const bytesWritten = buffer.length

  log.info(
    { driveFileId, s3Key, bytesWritten },
    expectedSize > FIFTY_MB ? 'Uploading large file to R2' : 'Uploading file to R2',
  )

  await s3.send(
    new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: s3Key,
      Body: buffer,
      ContentType: mimeType,
      CacheControl: 'public, max-age=31536000, immutable',
      StorageClass: 'INTELLIGENT_TIERING',
    }),
  )

  return { bytesWritten }
}
