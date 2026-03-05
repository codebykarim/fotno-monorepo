import OpenAI from 'openai'
import { env } from '../constants/env'
import { logger } from '../utils/logger'

let client: OpenAI | null = null

function getClient(): OpenAI | null {
  if (!env.OPENAI_API_KEY) return null
  if (!client) {
    client = new OpenAI({ apiKey: env.OPENAI_API_KEY })
  }
  return client
}

export function isLlmAvailable(): boolean {
  return !!env.OPENAI_API_KEY
}

interface PhotoForLlm {
  photoId: string
  caption: string | null
  tags: string[]
}

/**
 * Uses an LLM to filter photos based on a natural language query + gallery context.
 * The LLM can understand names, roles, and exclusion logic that vector search cannot.
 *
 * Returns photoIds sorted by relevance, or null if LLM is unavailable/fails.
 */
export async function llmFilterPhotos(params: {
  prompt: string
  context: string
  photos: PhotoForLlm[]
}): Promise<string[] | null> {
  const openai = getClient()
  if (!openai) return null

  const { prompt, context, photos } = params

  if (photos.length === 0) return []

  const photoList = photos
    .map((p, i) => {
      const tags = p.tags.length > 0 ? ` | Tags: ${p.tags.join(', ')}` : ''
      const caption = p.caption || 'No caption'
      return `${i + 1}. [${p.photoId}] ${caption}${tags}`
    })
    .join('\n')

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a photo search assistant. Given a gallery description, a list of photos with captions/tags, and a search query, select ONLY the photos that match the query.

Rules:
- Use the gallery context to map names to visual descriptions (e.g. if context says "Karim is the groom", then "Karim" = the person described as groom in captions)
- Pay attention to exclusion words like "only", "alone", "just" — these mean NO other people
- "X and Y alone" means photos showing ONLY X and Y together, no one else
- "X only" means photos showing ONLY X, no one else
- Be strict: if unsure, exclude the photo
- Return photoIds in order of relevance (best match first)

Respond with JSON: { "photoIds": ["id1", "id2", ...] }`,
        },
        {
          role: 'user',
          content: `Gallery context: ${context}

Search query: ${prompt}

Photos:
${photoList}`,
        },
      ],
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      logger.warn('LLM returned empty response')
      return null
    }

    const parsed = JSON.parse(content) as { photoIds?: string[] }
    if (!Array.isArray(parsed.photoIds)) {
      logger.warn({ content }, 'LLM response missing photoIds array')
      return null
    }

    // Validate that returned IDs are from our photo list
    const validIds = new Set(photos.map((p) => p.photoId))
    const filtered = parsed.photoIds.filter((id) => validIds.has(id))

    logger.info(
      { prompt, candidates: photos.length, matched: filtered.length },
      'LLM photo filtering complete'
    )

    return filtered
  } catch (error) {
    logger.error({ error }, 'LLM filtering failed, falling back to vector search')
    return null
  }
}
