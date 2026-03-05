import { query } from '../utils/db'
import { embedText } from './siglip.client'
import { logger } from '../utils/logger'
import { llmFilterPhotos, isLlmAvailable } from './llm.service'
import pgvector from 'pgvector'

interface SearchResult {
  photoId: string
  score: number
  caption: string | null
  tags: string[]
  thumbnailUrl: string | null
}

const DEFAULT_MIN_SCORE = 0.04
const LLM_PHOTO_THRESHOLD = 200

interface SearchParams {
  userId: string
  galleryId: string
  prompt: string
  context?: string
  limit: number
  minScore?: number
}

/**
 * When gallery context is available AND an LLM is configured, use the LLM to
 * intelligently filter photos based on captions/tags. This handles:
 * - Name→role mapping (e.g. "Karim" → groom)
 * - Exclusion logic ("only", "alone")
 * - Semantic understanding that vector search can't do
 *
 * For large galleries, we first narrow candidates with vector search,
 * then let the LLM refine. For small galleries, LLM sees all photos.
 */
async function llmSearch(params: SearchParams): Promise<SearchResult[] | null> {
  const { userId, galleryId, prompt, context, limit } = params

  if (!context || !isLlmAvailable()) return null

  // For large galleries, first narrow candidates with vector search
  // For small galleries (<= threshold), send all photos to LLM
  let candidates: SearchResult[]

  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*)::text as count FROM image_search_image
     WHERE "galleryId" = $1 AND "userId" = $2 AND embedding IS NOT NULL`,
    [galleryId, userId]
  )
  const totalPhotos = parseInt(countResult[0]?.count ?? '0', 10)

  if (totalPhotos <= LLM_PHOTO_THRESHOLD) {
    // Small gallery: fetch all photos for LLM
    candidates = await query<SearchResult>(
      `SELECT "photoId", 0 as score, caption, tags, "thumbnailUrl"
       FROM image_search_image
       WHERE "galleryId" = $1 AND "userId" = $2 AND embedding IS NOT NULL`,
      [galleryId, userId]
    )
  } else {
    // Large gallery: pre-filter with vector search, then LLM refines
    const textEmbedding = await embedText(prompt)
    candidates = await query<SearchResult>(
      `SELECT "photoId", 1 - (embedding <=> $1) as score, caption, tags, "thumbnailUrl"
       FROM image_search_image
       WHERE "galleryId" = $2 AND "userId" = $3 AND embedding IS NOT NULL
       ORDER BY embedding <=> $1
       LIMIT $4`,
      [pgvector.toSql(textEmbedding), galleryId, userId, Math.min(LLM_PHOTO_THRESHOLD, limit * 3)]
    )
  }

  if (candidates.length === 0) return null

  const llmResult = await llmFilterPhotos({
    prompt,
    context,
    photos: candidates.map((c) => ({
      photoId: c.photoId,
      caption: c.caption,
      tags: c.tags,
    })),
  })

  if (!llmResult || llmResult.length === 0) return null

  // Build results in LLM-determined order with scores
  const candidateMap = new Map(candidates.map((c) => [c.photoId, c]))
  const results: SearchResult[] = []
  for (let i = 0; i < llmResult.length && results.length < limit; i++) {
    const candidate = candidateMap.get(llmResult[i])
    if (candidate) {
      results.push({
        ...candidate,
        // Score based on LLM rank position (1.0 for first, decreasing)
        score: 1 - i / llmResult.length,
      })
    }
  }

  logger.info(
    { galleryId, prompt, candidates: candidates.length, llmFiltered: results.length },
    'LLM search complete'
  )

  return results
}

export async function searchPhotos(params: SearchParams): Promise<SearchResult[]> {
  const { userId, galleryId, prompt, context, limit, minScore = DEFAULT_MIN_SCORE } = params

  // Try LLM-based search first (when context is available)
  const llmResults = await llmSearch(params)
  if (llmResults) return llmResults

  // Fallback: hybrid text + vector search (no LLM)
  // Don't prepend context to embedding — it makes vectors too generic
  logger.info({ galleryId, prompt, limit, minScore }, 'Searching photos (hybrid, no LLM)')

  const textEmbedding = await embedText(prompt)
  const maxDistance = 1 - minScore

  // Full-text search on captions+tags
  const stopWords = new Set(['and', 'or', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'not', 'no', 'but', 'if', 'than', 'too', 'very', 'just', 'about', 'up', 'out', 'so', 'that', 'this', 'it', 'its', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'between', 'under', 'over', 'again', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same', 'also', 'together'])
  const words = prompt
    .split(/\s+/)
    .map((w) => w.replace(/[^\w]/g, '').toLowerCase())
    .filter((w) => w.length > 0 && !stopWords.has(w))

  const tsQueryOr = words.join(' | ')
  const hasTextQuery = words.length > 0

  if (hasTextQuery) {
    const textResults = await query<SearchResult>(
      `SELECT
        "photoId",
        (0.7 * ts_rank("captionTsv", to_tsquery('english', $5))
         + 0.3 * CASE WHEN embedding IS NOT NULL THEN 1 - (embedding <=> $1) ELSE 0 END
        ) as score,
        caption,
        tags,
        "thumbnailUrl"
      FROM image_search_image
      WHERE "galleryId" = $2
        AND "userId" = $3
        AND "captionTsv" @@ to_tsquery('english', $5)
      ORDER BY
        (0.7 * ts_rank("captionTsv", to_tsquery('english', $5))
         + 0.3 * CASE WHEN embedding IS NOT NULL THEN 1 - (embedding <=> $1) ELSE 0 END
        ) DESC
      LIMIT $4`,
      [pgvector.toSql(textEmbedding), galleryId, userId, limit, tsQueryOr]
    )

    if (textResults.length > 0) {
      logger.info({ galleryId, resultCount: textResults.length }, 'Text search complete')
      return textResults
    }

    logger.info({ galleryId }, 'No text matches, falling back to vector search')
  }

  // Fallback: vector-only search
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
      AND (embedding <=> $1) <= $5
    ORDER BY embedding <=> $1
    LIMIT $4`,
    [pgvector.toSql(textEmbedding), galleryId, userId, limit, maxDistance]
  )

  logger.info({ galleryId, resultCount: results.length, minScore }, 'Vector search complete')
  return results
}

export async function searchPhotoIds(params: SearchParams): Promise<string[]> {
  const results = await searchPhotos(params)
  return results.map((r) => r.photoId)
}
