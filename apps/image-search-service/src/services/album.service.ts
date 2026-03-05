import { query, queryOne } from '../utils/db'
import { searchPhotoIds } from './search.service'
import { logger } from '../utils/logger'

interface SuggestAlbumParams {
  userId: string
  galleryId: string
  prompt: string
  context?: string
  albumSize: number
  useLlm?: boolean
}

interface AlbumSuggestion {
  photoIds: string[]
  albumTitle?: string
  albumDescription?: string
  cached: boolean
}

interface CachedAlbum {
  photoIds: string[]
  albumTitle: string | null
  albumDescription: string | null
}

function normalizePrompt(prompt: string): string {
  return prompt.toLowerCase().trim().replace(/\s+/g, ' ')
}

async function getCachedAlbum(
  galleryId: string,
  userId: string,
  normalizedPrompt: string
): Promise<CachedAlbum | null> {
  const cached = await queryOne<CachedAlbum>(
    `SELECT "photoIds", "albumTitle", "albumDescription"
     FROM image_search_album_cache
     WHERE "galleryId" = $1
       AND "userId" = $2
       AND "normalizedPrompt" = $3
       AND "expiresAt" > NOW()`,
    [galleryId, userId, normalizedPrompt]
  )
  return cached
}

async function cacheAlbum(
  galleryId: string,
  userId: string,
  normalizedPrompt: string,
  photoIds: string[],
  albumTitle?: string,
  albumDescription?: string,
  ttlHours: number = 24
): Promise<void> {
  await query(
    `INSERT INTO image_search_album_cache
      (id, "galleryId", "userId", "normalizedPrompt", "photoIds", "albumTitle", "albumDescription", "expiresAt")
    VALUES
      (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW() + INTERVAL '${ttlHours} hours')
    ON CONFLICT ("galleryId", "userId", "normalizedPrompt")
    DO UPDATE SET
      "photoIds" = $4,
      "albumTitle" = $5,
      "albumDescription" = $6,
      "expiresAt" = NOW() + INTERVAL '${ttlHours} hours',
      "createdAt" = NOW()`,
    [galleryId, userId, normalizedPrompt, photoIds, albumTitle ?? null, albumDescription ?? null]
  )
}

export async function suggestAlbum(params: SuggestAlbumParams): Promise<AlbumSuggestion> {
  const { userId, galleryId, prompt, context, albumSize } = params

  logger.info({ galleryId, prompt, albumSize }, 'Suggesting album')

  const normalizedPrompt = normalizePrompt(prompt)

  // Check cache first
  const cached = await getCachedAlbum(galleryId, userId, normalizedPrompt)
  if (cached) {
    logger.info({ galleryId }, 'Returning cached album suggestion')
    return {
      photoIds: cached.photoIds.slice(0, albumSize),
      albumTitle: cached.albumTitle ?? undefined,
      albumDescription: cached.albumDescription ?? undefined,
      cached: true,
    }
  }

  // Use vector search to get matching photos
  const photoIds = await searchPhotoIds({
    userId,
    galleryId,
    prompt,
    context,
    limit: albumSize,
  })

  // Cache the result
  await cacheAlbum(galleryId, userId, normalizedPrompt, photoIds)

  logger.info({ galleryId, resultCount: photoIds.length }, 'Album suggestion complete')

  return {
    photoIds,
    cached: false,
  }
}

export async function invalidateAlbumCache(galleryId: string): Promise<void> {
  await query('DELETE FROM image_search_album_cache WHERE "galleryId" = $1', [galleryId])
  logger.info({ galleryId }, 'Invalidated album cache')
}

export async function cleanupExpiredCache(): Promise<number> {
  const result = await query<{ count: string }>(
    `WITH deleted AS (
      DELETE FROM image_search_album_cache
      WHERE "expiresAt" < NOW()
      RETURNING 1
    )
    SELECT COUNT(*) as count FROM deleted`
  )
  const count = parseInt(result[0]?.count ?? '0', 10)
  if (count > 0) {
    logger.info({ count }, 'Cleaned up expired album cache entries')
  }
  return count
}
