import { query } from '../utils/db'
import { embedText } from './siglip.client'
import { logger } from '../utils/logger'
import pgvector from 'pgvector'

interface SearchResult {
  photoId: string
  score: number
  caption: string | null
  tags: string[]
  thumbnailUrl: string | null
}

interface SearchParams {
  userId: string
  galleryId: string
  prompt: string
  limit: number
}

export async function searchPhotos(params: SearchParams): Promise<SearchResult[]> {
  const { userId, galleryId, prompt, limit } = params

  logger.info({ galleryId, prompt, limit }, 'Searching photos')

  // Embed the text prompt
  const textEmbedding = await embedText(prompt)

  // Perform vector similarity search using cosine distance
  // pgvector uses <=> for cosine distance (1 - cosine_similarity)
  const results = await query<SearchResult>(
    `SELECT
      "photoId",
      1 - (embedding <=> $1) as score,
      caption,
      tags,
      "thumbnailUrl"
    FROM image_search_image
    WHERE "galleryId" = $2
      AND "userId" = $3
      AND embedding IS NOT NULL
    ORDER BY embedding <=> $1
    LIMIT $4`,
    [pgvector.toSql(textEmbedding), galleryId, userId, limit]
  )

  logger.info({ galleryId, resultCount: results.length }, 'Search complete')

  return results
}

export async function searchPhotoIds(params: SearchParams): Promise<string[]> {
  const results = await searchPhotos(params)
  return results.map((r) => r.photoId)
}
