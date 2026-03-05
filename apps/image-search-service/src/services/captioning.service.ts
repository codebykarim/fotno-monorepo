import { query } from '../utils/db'
import { getPresignedUrl } from '../utils/s3'
import { logger } from '../utils/logger'
import { env } from '../constants/env'
import { captionImage } from './florence.client'
import { findMatchingCaption, addToLibrary } from './caption-library.service'
import { prisma } from '@workspace/db'

interface UncaptionedPhoto {
  id: string
  photoId: string
  galleryId: string
  storageUrl: string
  embedding: number[]
}

interface Cluster {
  representative: UncaptionedPhoto
  members: UncaptionedPhoto[]
}

const MAX_CAPTION_ATTEMPTS = 3

export async function getUncaptionedPhotos(galleryId?: string): Promise<UncaptionedPhoto[]> {
  const whereClause = galleryId
    ? 'WHERE embedding IS NOT NULL AND "captionedAt" IS NULL AND "captionAttempts" < $2 AND "galleryId" = $1'
    : 'WHERE embedding IS NOT NULL AND "captionedAt" IS NULL AND "captionAttempts" < $1'

  return query<UncaptionedPhoto>(
    `SELECT id, "photoId", "galleryId", "storageUrl", embedding
    FROM image_search_image
    ${whereClause}
    ORDER BY "createdAt" ASC`,
    galleryId ? [galleryId, MAX_CAPTION_ATTEMPTS] : [MAX_CAPTION_ATTEMPTS]
  )
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

export function clusterPhotos(photos: UncaptionedPhoto[], threshold: number): Cluster[] {
  const assigned = new Set<number>()
  const clusters: Cluster[] = []

  for (let i = 0; i < photos.length; i++) {
    if (assigned.has(i)) continue

    const cluster: Cluster = {
      representative: photos[i],
      members: [photos[i]],
    }
    assigned.add(i)

    for (let j = i + 1; j < photos.length; j++) {
      if (assigned.has(j)) continue

      const sim = cosineSimilarity(photos[i].embedding, photos[j].embedding)
      if (sim >= threshold) {
        cluster.members.push(photos[j])
        assigned.add(j)
      }
    }

    clusters.push(cluster)
  }

  return clusters
}

async function applyCaptionToPhotos(
  photos: UncaptionedPhoto[],
  caption: string,
  tags: string[],
  source: string
): Promise<void> {
  for (const photo of photos) {
    await query(
      `UPDATE image_search_image
      SET caption = $2, tags = $3, "captionedAt" = NOW(), "captionSource" = $4, "updatedAt" = NOW()
      WHERE id = $1`,
      [photo.id, caption, tags, source]
    )
  }
}

async function syncCaptionsToPrisma(
  photos: UncaptionedPhoto[],
  caption: string,
  tags: string[]
): Promise<void> {
  const photoIds = photos.map((p) => p.photoId)
  try {
    await prisma.photo.updateMany({
      where: { id: { in: photoIds } },
      data: { aiCaption: caption, aiTags: tags },
    })
  } catch (error) {
    logger.warn({ error, photoIds }, 'Failed to sync captions to main DB (non-fatal)')
  }
}

export async function processCaptioning(galleryId?: string): Promise<{
  totalPhotos: number
  clusters: number
  libraryHits: number
  apiCalls: number
}> {
  const photos = await getUncaptionedPhotos(galleryId)

  if (photos.length === 0) {
    logger.info({ galleryId }, 'No uncaptioned photos found')
    return { totalPhotos: 0, clusters: 0, libraryHits: 0, apiCalls: 0 }
  }

  logger.info({ galleryId, count: photos.length }, 'Starting captioning')

  const clusters = clusterPhotos(photos, env.CAPTION_CLUSTER_THRESHOLD)
  let libraryHits = 0
  let apiCalls = 0

  logger.info({ totalPhotos: photos.length, clusters: clusters.length }, 'Clustered photos')

  for (const cluster of clusters) {
    const rep = cluster.representative

    // Try caption library first
    const libraryMatch = await findMatchingCaption(
      rep.embedding,
      env.CAPTION_LIBRARY_SIMILARITY_THRESHOLD
    )

    if (libraryMatch) {
      await applyCaptionToPhotos(cluster.members, libraryMatch.caption, libraryMatch.tags, 'library')
      await syncCaptionsToPrisma(cluster.members, libraryMatch.caption, libraryMatch.tags)
      libraryHits++
      continue
    }

    // Call Florence-2 for the representative
    try {
      const presignedUrl = await getPresignedUrl(rep.storageUrl)
      const result = await captionImage(presignedUrl)

      const source = cluster.members.length > 1 ? 'florence2-cluster' : 'florence2'
      await applyCaptionToPhotos(cluster.members, result.caption, result.tags, source)
      await syncCaptionsToPrisma(cluster.members, result.caption, result.tags)

      // Add to library for future reuse
      await addToLibrary(rep.embedding, result.caption, result.tags, rep.photoId, rep.galleryId)

      apiCalls++
    } catch (error: any) {
      const errMsg = error?.message || String(error)
      logger.error({ error: errMsg, photoId: rep.photoId, clusterSize: cluster.members.length }, 'Failed to caption cluster representative')

      // Track failure on all members of this cluster
      const memberIds = cluster.members.map((m) => m.id)
      await query(
        `UPDATE image_search_image
         SET "captionAttempts" = "captionAttempts" + 1, "captionError" = $2, "updatedAt" = NOW()
         WHERE id = ANY($1)`,
        [memberIds, errMsg]
      )
    }
  }

  const stats = {
    totalPhotos: photos.length,
    clusters: clusters.length,
    libraryHits,
    apiCalls,
  }

  logger.info(stats, 'Captioning complete')
  return stats
}
