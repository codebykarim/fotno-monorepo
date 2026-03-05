import { query, queryOne } from '../utils/db'
import { embedImageBatch } from './siglip.client'
import { getPresignedUrl } from '../utils/s3'
import { logger } from '../utils/logger'
import pgvector from 'pgvector'

interface ImageSearchImage {
  id: string
  photoId: string
  userId: string
  galleryId: string
  storageUrl: string
  thumbnailUrl: string | null
  caption: string | null
  tags: string[]
  metadata: Record<string, unknown> | null
  embedding: number[] | null
  indexedAt: Date | null
  version: number
}

interface IngestPhotoPayload {
  photoId: string
  userId: string
  galleryId: string
  storageUrl: string
  thumbnailUrl?: string | null
  caption?: string | null
  tags?: string[]
  metadata?: Record<string, unknown> | null
}

export async function upsertImageRecord(payload: IngestPhotoPayload): Promise<string> {
  const existing = await queryOne<{ id: string }>(
    'SELECT id FROM image_search_image WHERE "photoId" = $1',
    [payload.photoId]
  )

  if (existing) {
    await query(
      `UPDATE image_search_image SET
        "userId" = $2,
        "galleryId" = $3,
        "storageUrl" = $4,
        "thumbnailUrl" = $5,
        caption = $6,
        tags = $7,
        metadata = $8,
        "updatedAt" = NOW()
      WHERE id = $1`,
      [
        existing.id,
        payload.userId,
        payload.galleryId,
        payload.storageUrl,
        payload.thumbnailUrl ?? null,
        payload.caption ?? null,
        payload.tags ?? [],
        payload.metadata ? JSON.stringify(payload.metadata) : null,
      ]
    )
    return existing.id
  }

  const result = await query<{ id: string }>(
    `INSERT INTO image_search_image
      (id, "photoId", "userId", "galleryId", "storageUrl", "thumbnailUrl", caption, tags, metadata)
    VALUES
      (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id`,
    [
      payload.photoId,
      payload.userId,
      payload.galleryId,
      payload.storageUrl,
      payload.thumbnailUrl ?? null,
      payload.caption ?? null,
      payload.tags ?? [],
      payload.metadata ? JSON.stringify(payload.metadata) : null,
    ]
  )

  return result[0].id
}

const MAX_EMBEDDING_ATTEMPTS = 3

export async function getPhotosNeedingEmbedding(limit: number): Promise<ImageSearchImage[]> {
  return query<ImageSearchImage>(
    `SELECT * FROM image_search_image
     WHERE embedding IS NULL AND "embeddingAttempts" < $2
     ORDER BY "createdAt" ASC
     LIMIT $1`,
    [limit, MAX_EMBEDDING_ATTEMPTS]
  )
}

export async function updateEmbeddings(
  updates: Array<{ id: string; embedding: number[] }>
): Promise<void> {
  for (const { id, embedding } of updates) {
    await query(
      `UPDATE image_search_image
       SET embedding = $2, "indexedAt" = NOW()
       WHERE id = $1`,
      [id, pgvector.toSql(embedding)]
    )
  }
  logger.info({ count: updates.length }, 'Updated embeddings')
}

async function markEmbeddingFailed(id: string, error: string): Promise<void> {
  await query(
    `UPDATE image_search_image
     SET "embeddingAttempts" = "embeddingAttempts" + 1, "embeddingError" = $2, "updatedAt" = NOW()
     WHERE id = $1`,
    [id, error]
  )
}

export async function processEmbeddingBatch(batchSize: number): Promise<{
  count: number
  galleryIds: Set<string>
}> {
  const photos = await getPhotosNeedingEmbedding(batchSize)

  if (photos.length === 0) {
    return { count: 0, galleryIds: new Set() }
  }

  logger.info({ count: photos.length }, 'Processing embedding batch')

  // Try batch first — fastest path
  try {
    const imageUrls = await Promise.all(
      photos.map((p) => getPresignedUrl(p.storageUrl))
    )

    const embeddings = await embedImageBatch(imageUrls)

    const updates = photos.map((photo, index) => ({
      id: photo.id,
      embedding: embeddings[index],
    }))

    await updateEmbeddings(updates)

    const galleryIds = new Set(photos.map((p) => p.galleryId))
    return { count: photos.length, galleryIds }
  } catch (batchError) {
    logger.warn({ error: batchError }, 'Batch embedding failed, falling back to per-image processing')
  }

  // Fallback: process each image individually to isolate failures
  const successfulUpdates: Array<{ id: string; embedding: number[] }> = []
  const galleryIds = new Set<string>()

  for (const photo of photos) {
    try {
      const imageUrl = await getPresignedUrl(photo.storageUrl)
      const embeddings = await embedImageBatch([imageUrl])
      successfulUpdates.push({ id: photo.id, embedding: embeddings[0] })
      galleryIds.add(photo.galleryId)
    } catch (error: any) {
      const errMsg = error?.message || String(error)
      logger.error({ photoId: photo.photoId, error: errMsg }, 'Failed to embed individual image')
      await markEmbeddingFailed(photo.id, errMsg)
    }
  }

  if (successfulUpdates.length > 0) {
    await updateEmbeddings(successfulUpdates)
  }

  return { count: successfulUpdates.length, galleryIds }
}

export async function deleteImageRecord(photoId: string): Promise<void> {
  await query('DELETE FROM image_search_image WHERE "photoId" = $1', [photoId])
  logger.info({ photoId }, 'Deleted image record')
}
