import { query, queryOne } from '../utils/db'
import { logger } from '../utils/logger'
import pgvector from 'pgvector'

interface LibraryEntry {
  id: string
  caption: string
  tags: string[]
  usageCount: number
  similarity: number
}

interface LibraryStats {
  totalEntries: number
  totalUsageCount: number
}

export async function findMatchingCaption(
  embedding: number[],
  threshold: number
): Promise<LibraryEntry | null> {
  const result = await queryOne<LibraryEntry>(
    `SELECT
      id,
      caption,
      tags,
      "usageCount",
      1 - (embedding <=> $1) as similarity
    FROM caption_library
    WHERE 1 - (embedding <=> $1) >= $2
    ORDER BY embedding <=> $1
    LIMIT 1`,
    [pgvector.toSql(embedding), threshold]
  )

  if (result) {
    // Increment usage count
    await query('UPDATE caption_library SET "usageCount" = "usageCount" + 1, "updatedAt" = NOW() WHERE id = $1', [
      result.id,
    ])
    logger.debug({ similarity: result.similarity, caption: result.caption.slice(0, 60) }, 'Caption library hit')
  }

  return result
}

export async function addToLibrary(
  embedding: number[],
  caption: string,
  tags: string[],
  sourcePhotoId?: string,
  sourceGalleryId?: string
): Promise<string> {
  // Check for near-duplicate (>0.96 similarity) — just increment usage
  const nearDuplicate = await queryOne<{ id: string }>(
    `SELECT id
    FROM caption_library
    WHERE 1 - (embedding <=> $1) >= 0.96
    ORDER BY embedding <=> $1
    LIMIT 1`,
    [pgvector.toSql(embedding)]
  )

  if (nearDuplicate) {
    await query('UPDATE caption_library SET "usageCount" = "usageCount" + 1, "updatedAt" = NOW() WHERE id = $1', [
      nearDuplicate.id,
    ])
    logger.debug({ id: nearDuplicate.id }, 'Near-duplicate in library, incremented usage')
    return nearDuplicate.id
  }

  const result = await query<{ id: string }>(
    `INSERT INTO caption_library (id, embedding, caption, tags, "sourcePhotoId", "sourceGalleryId")
    VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
    RETURNING id`,
    [pgvector.toSql(embedding), caption, tags, sourcePhotoId ?? null, sourceGalleryId ?? null]
  )

  logger.debug({ id: result[0].id, caption: caption.slice(0, 60) }, 'Added to caption library')
  return result[0].id
}

export async function getLibraryStats(): Promise<LibraryStats> {
  const result = await queryOne<{ totalEntries: string; totalUsageCount: string }>(
    'SELECT COUNT(*) as "totalEntries", COALESCE(SUM("usageCount"), 0) as "totalUsageCount" FROM caption_library'
  )

  return {
    totalEntries: Number(result?.totalEntries ?? 0),
    totalUsageCount: Number(result?.totalUsageCount ?? 0),
  }
}
