import { env } from '../constants/env'
import { logger } from '../utils/logger'

interface EmbeddingResponse {
  embedding: number[]
}

interface BatchEmbeddingResponse {
  embeddings: number[][]
}

export async function embedImage(imageUrl: string): Promise<number[]> {
  const response = await fetch(`${env.SIGLIP_SERVICE_URL}/embed-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imageUrl }),
  })

  if (!response.ok) {
    const error = await response.text()
    logger.error({ imageUrl, error }, 'Failed to embed image')
    throw new Error(`SigLIP embed-image failed: ${error}`)
  }

  const data = (await response.json()) as EmbeddingResponse
  return data.embedding
}

export async function embedImageBatch(imageUrls: string[]): Promise<number[][]> {
  const response = await fetch(`${env.SIGLIP_SERVICE_URL}/embed-image/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_urls: imageUrls }),
  })

  if (!response.ok) {
    const error = await response.text()
    logger.error({ count: imageUrls.length, error }, 'Failed to embed image batch')
    throw new Error(`SigLIP embed-image batch failed: ${error}`)
  }

  const data = (await response.json()) as BatchEmbeddingResponse
  return data.embeddings
}

export async function embedText(text: string): Promise<number[]> {
  const response = await fetch(`${env.SIGLIP_SERVICE_URL}/embed-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    const error = await response.text()
    logger.error({ text, error }, 'Failed to embed text')
    throw new Error(`SigLIP embed-text failed: ${error}`)
  }

  const data = (await response.json()) as EmbeddingResponse
  return data.embedding
}

export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${env.SIGLIP_SERVICE_URL}/health`)
    return response.ok
  } catch {
    return false
  }
}
