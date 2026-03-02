import { query, queryOne } from '../utils/db'
import { embedImageBatch } from './siglip.client'
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

export async function getPhotosNeedingEmbedding(limit: number): Promise<ImageSearchImage[]> {
  return query<ImageSearchImage>(
    `SELECT * FROM image_search_image
     WHERE embedding IS NULL
     ORDER BY "createdAt" ASC
     LIMIT $1`,
    [limit]
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

export async function processEmbeddingBatch(batchSize: number): Promise<number> {
  const photos = await getPhotosNeedingEmbedding(batchSize)

  if (photos.length === 0) {
    return 0
  }

  logger.info({ count: photos.length }, 'Processing embedding batch')

  const imageUrls = photos.map((p) => p.storageUrl)

  try {
    const embeddings = await embedImageBatch(imageUrls)

    const updates = photos.map((photo, index) => ({
      id: photo.id,
      embedding: embeddings[index],
    }))

    await updateEmbeddings(updates)

    return photos.length
  } catch (error) {
    logger.error({ error }, 'Failed to process embedding batch')
    throw error
  }
}

export async function deleteImageRecord(photoId: string): Promise<void> {
  await query('DELETE FROM image_search_image WHERE "photoId" = $1', [photoId])
  logger.info({ photoId }, 'Deleted image record')
}
