/**
 * Backfill blurDataUrl for existing processed photos that don't have one.
 *
 * Usage:
 *   npx tsx apps/upload-service/scripts/backfill-blur.ts
 *
 * Requires the same environment variables as the upload-service
 * (DATABASE_URL / DIRECT_URL, AWS_REGION, AWS_S3_BUCKET, etc.).
 */

import sharp from 'sharp'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import type { Readable } from 'node:stream'
import { prisma } from '@workspace/db'

const BATCH_SIZE = 50
const CONCURRENCY = 5

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      }
    : {}),
})
const bucket = process.env.AWS_S3_BUCKET!

async function downloadToBuffer(key: string): Promise<Buffer> {
  const response = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
  if (!response.Body) throw new Error(`Empty body for key: ${key}`)
  const chunks: Buffer[] = []
  const sink = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      callback()
    },
  })
  await pipeline(response.Body as Readable, sink)
  return Buffer.concat(chunks)
}

async function generateBlurDataUrl(input: Buffer): Promise<string> {
  const tiny = await sharp(input)
    .resize(16, undefined, { fit: 'inside' })
    .webp({ quality: 20 })
    .toBuffer()
  return `data:image/webp;base64,${tiny.toString('base64')}`
}

async function processPhoto(photo: { id: string; previewKey: string | null; thumbnailKey: string | null }): Promise<boolean> {
  const key = photo.previewKey ?? photo.thumbnailKey
  if (!key) return false

  try {
    const buffer = await downloadToBuffer(key)
    const blurDataUrl = await generateBlurDataUrl(buffer)
    await prisma.photo.update({
      where: { id: photo.id },
      data: { blurDataUrl },
    })
    return true
  } catch (err: any) {
    console.error(`  Failed photo ${photo.id}: ${err.message}`)
    return false
  }
}

async function main() {
  let offset = 0
  let totalProcessed = 0
  let totalFailed = 0

  console.log('Starting blurDataUrl backfill...')

  while (true) {
    const photos = await prisma.photo.findMany({
      where: {
        blurDataUrl: null,
        status: 'processed',
        OR: [{ previewKey: { not: null } }, { thumbnailKey: { not: null } }],
      },
      select: { id: true, previewKey: true, thumbnailKey: true },
      take: BATCH_SIZE,
      skip: offset,
    })

    if (photos.length === 0) break

    console.log(`Processing batch of ${photos.length} photos (offset ${offset})...`)

    // Process in parallel with limited concurrency
    for (let i = 0; i < photos.length; i += CONCURRENCY) {
      const chunk = photos.slice(i, i + CONCURRENCY)
      const results = await Promise.all(chunk.map(processPhoto))
      const succeeded = results.filter(Boolean).length
      totalProcessed += succeeded
      totalFailed += results.length - succeeded
    }

    console.log(`  Progress: ${totalProcessed} done, ${totalFailed} failed`)

    // Don't increment offset — we're filtering by blurDataUrl: null, so processed
    // photos drop out of the query. Only increment if we had failures.
    if (totalFailed > 0) {
      offset += totalFailed
    }
  }

  console.log(`\nBackfill complete: ${totalProcessed} photos updated, ${totalFailed} failures.`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Backfill failed:', err)
  process.exit(1)
})
