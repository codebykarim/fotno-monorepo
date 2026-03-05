import { env } from '../constants/env'
import { logger } from '../utils/logger'

interface CaptionResult {
  caption: string
  tags: string[]
}

export async function captionImage(imageUrl: string): Promise<CaptionResult> {
  const response = await fetch(`${env.FLORENCE_SERVICE_URL}/caption`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imageUrl }),
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Florence-2 captioning failed (${response.status}): ${detail}`)
  }

  const result = (await response.json()) as CaptionResult

  if (!result.caption || !Array.isArray(result.tags)) {
    logger.warn({ result }, 'Unexpected caption format from Florence-2')
    return {
      caption: result.caption || '',
      tags: Array.isArray(result.tags) ? result.tags : [],
    }
  }

  return result
}
