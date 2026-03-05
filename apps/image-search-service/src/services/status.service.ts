import { query, queryOne } from '../utils/db'
import { logger } from '../utils/logger'

interface GalleryStatus {
  total: number
  embedded: number
  captioned: number
  failed: number
  ready: boolean
}

export async function getGalleryStatus(galleryId: string): Promise<GalleryStatus> {
  logger.info({ galleryId }, 'Getting gallery processing status')

  const row = await queryOne<{
    total: string
    embedded: string
    captioned: string
    failed: string
  }>(
    `SELECT
      COUNT(*)::text AS total,
      COUNT(CASE WHEN embedding IS NOT NULL THEN 1 END)::text AS embedded,
      COUNT(CASE WHEN "captionedAt" IS NOT NULL THEN 1 END)::text AS captioned,
      COUNT(CASE WHEN "embeddingAttempts" >= 3 AND embedding IS NULL THEN 1 END)::text AS failed
    FROM image_search_image
    WHERE "galleryId" = $1`,
    [galleryId]
  )

  const total = parseInt(row?.total ?? '0', 10)
  const embedded = parseInt(row?.embedded ?? '0', 10)
  const captioned = parseInt(row?.captioned ?? '0', 10)
  const failed = parseInt(row?.failed ?? '0', 10)

  return {
    total,
    embedded,
    captioned,
    failed,
    ready: total > 0 && embedded === total,
  }
}
