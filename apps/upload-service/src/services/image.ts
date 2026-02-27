import sharp from 'sharp'
import { RAW_MIME_TYPES } from '../constants/upload'
import { Errors } from '../errors/index'
import type { ProcessingResult } from '../interfaces/index'
import { logger } from '../utils/logger'
import { multipartService } from './multipart'

const THUMBNAIL_MAX_BYTES = 250_000 // 250KB
const PREVIEW_MAX_BYTES = 1_000_000 // 1MB

/**
 * Service that generates thumbnails and previews from uploaded photos.
 * Handles RAW formats by extracting embedded JPEG previews via Sharp.
 * Outputs WebP under size budgets; used by the process-photo BullMQ worker.
 */
class ImageService {
  private readonly log = logger.child({ module: 'image.service' })

  /**
   * Downloads the original from S3, generates thumbnail (≤250KB) and preview (≤1MB) in WebP,
   * uploads both to S3, and returns their keys and sizes. For RAW files, extracts embedded preview first.
   */
  async processPhoto(
    photoId: string,
    galleryId: string,
    s3Key: string,
    s3Bucket: string,
    mimeType: string,
  ): Promise<ProcessingResult> {
    const log = this.log.child({ photoId, s3Key, s3Bucket })

    const originalBuffer = await multipartService.downloadToBuffer(s3Key)

    let workingBuffer = originalBuffer
    if (this.isRawFormat(mimeType)) {
      try {
        // sharp decodes RAW files through embedded previews where supported.
        workingBuffer = await sharp(originalBuffer).jpeg({ quality: 90 }).toBuffer()
      } catch (error) {
        log.error({ err: error }, 'RAW preview extraction failed')
        throw Errors.PROCESSING_FAILED('Failed to extract embedded JPEG preview from RAW image')
      }
    }

    const thumbnail = await this.compressWebpUnderBudget(workingBuffer, THUMBNAIL_MAX_BYTES)
    const preview = await this.compressWebpUnderBudget(workingBuffer, PREVIEW_MAX_BYTES)

    const thumbnailKey = multipartService.buildThumbnailKey(galleryId, photoId)
    const previewKey = multipartService.buildPreviewKey(galleryId, photoId)

    await Promise.all([
      multipartService.uploadBuffer(thumbnailKey, thumbnail.buffer, 'image/webp'),
      multipartService.uploadBuffer(previewKey, preview.buffer, 'image/webp'),
    ])

    return {
      thumbnail: {
        s3Key: thumbnailKey,
        size: BigInt(thumbnail.buffer.byteLength),
        width: thumbnail.width,
        height: thumbnail.height,
      },
      preview: {
        s3Key: previewKey,
        size: BigInt(preview.buffer.byteLength),
        width: preview.width,
        height: preview.height,
      },
    }
  }

  /**
   * Compresses the input image to WebP under the given byte budget. Iteratively reduces quality
   * and then size until the result fits. Used for both thumbnail and preview generation.
   */
  private async compressWebpUnderBudget(
    input: Buffer,
    maxBytes: number,
  ): Promise<{ buffer: Buffer; width: number; height: number }> {
    const metadata = await sharp(input).metadata()

    if (!metadata.width || !metadata.height) {
      throw Errors.PROCESSING_FAILED('Image dimensions are missing')
    }

    let quality = 85
    let currentWidth = metadata.width
    let currentHeight = metadata.height

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const result = await sharp(input)
        .resize(currentWidth, currentHeight)
        .webp({ quality })
        .toBuffer()

      if (result.byteLength <= maxBytes) {
        return {
          buffer: result,
          width: currentWidth,
          height: currentHeight,
        }
      }

      quality -= 5

      if (quality < 20) {
        quality = 20
        currentWidth = Math.max(1, Math.floor(currentWidth * 0.9))
        currentHeight = Math.max(1, Math.floor(currentHeight * 0.9))
      }
    }

    throw Errors.PROCESSING_FAILED('Could not compress image within budget')
  }

  /** Returns true if the MIME type is a RAW camera format that needs embedded-preview extraction. */
  private isRawFormat(mimeType: string): boolean {
    return RAW_MIME_TYPES.has(mimeType)
  }
}

export const imageService = new ImageService()
