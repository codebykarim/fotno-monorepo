import { PutObjectCommand, S3Client, type S3ClientConfig } from '@aws-sdk/client-s3'
import { env } from '../constants/env'
import { logger } from '../utils/logger'

const log = logger.child({ module: 'gphotos-download' })

const PICKER_API = 'https://photospicker.googleapis.com/v1'

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

interface PickedMediaItem {
  id: string
  type: string
  mediaFile: {
    baseUrl: string
    mimeType: string
    filename: string
  }
}

/**
 * List all media items from a picker session and return a map of id → baseUrl.
 */
export async function fetchPickerBaseUrls(
  accessToken: string,
  sessionId: string,
): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  let pageToken: string | undefined

  do {
    const params = new URLSearchParams({ sessionId, pageSize: '100' })
    if (pageToken) params.set('pageToken', pageToken)

    const res = await fetch(`${PICKER_API}/mediaItems?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Picker API mediaItems list failed (${res.status}): ${text}`)
    }

    const data = (await res.json()) as {
      mediaItems?: PickedMediaItem[]
      nextPageToken?: string
    }

    for (const item of data.mediaItems ?? []) {
      map.set(item.id, item.mediaFile.baseUrl)
    }

    pageToken = data.nextPageToken
  } while (pageToken)

  return map
}

export async function downloadPhotosItemToR2(
  accessToken: string,
  baseUrl: string,
  s3Key: string,
  mimeType: string,
): Promise<{ bytesWritten: number }> {
  // =d downloads the original quality file
  const downloadUrl = `${baseUrl}=d`

  const res = await fetch(downloadUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Photos download failed (${res.status}): ${text}`)
  }

  const buffer = Buffer.from(await res.arrayBuffer())
  const bytesWritten = buffer.length

  log.info({ s3Key, bytesWritten }, 'Uploading Google Photos file to R2')

  await s3.send(
    new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: s3Key,
      Body: buffer,
      ContentType: mimeType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  )

  return { bytesWritten }
}
