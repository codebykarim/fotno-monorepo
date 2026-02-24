import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  ListPartsCommand,
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
  UploadPartCommand,
} from '@aws-sdk/client-s3'
import type { CompletedPart } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import type { Readable } from 'node:stream'
import { env } from '../constants/env'
import { PRESIGNED_URL_TTL_SEC } from '../constants/upload'
import { Errors } from '../errors/index'
import type { PartRecord, PresignedPart } from '../interfaces/index'
import { buildPartNumbers } from '../utils/chunks'
import { logger } from '../utils/logger'

class MultipartService {
  private readonly s3: S3Client

  private readonly bucket: string

  private readonly log = logger.child({ module: 'multipart.service' })

  constructor() {
    const clientConfig: S3ClientConfig = {
      region: env.AWS_REGION,
      ...(env.AWS_S3_ENDPOINT ? { endpoint: env.AWS_S3_ENDPOINT } : {}),
      forcePathStyle: Boolean(env.AWS_S3_ENDPOINT),
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    }

    if (env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY) {
      clientConfig.credentials = {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      }
    }

    this.s3 = new S3Client(clientConfig)
    this.bucket = env.AWS_S3_BUCKET
  }

  // S3 Key builders — single source of truth for all key patterns
  buildOriginalKey(galleryId: string, photoId: string, filename: string): string {
    return `originals/${galleryId}/${photoId}/${filename}`
  }

  buildThumbnailKey(galleryId: string, photoId: string): string {
    return `thumbnails/${galleryId}/${photoId}.webp`
  }

  buildPreviewKey(galleryId: string, photoId: string): string {
    return `previews/${galleryId}/${photoId}.webp`
  }

  async initUpload(key: string, mimeType: string): Promise<string> {
    try {
      const response = await this.s3.send(
        new CreateMultipartUploadCommand({
          Bucket: this.bucket,
          Key: key,
          ContentType: mimeType,
        }),
      )

      if (!response.UploadId) {
        throw Errors.S3_ERROR('Failed to initialize multipart upload')
      }

      return response.UploadId
    } catch (error) {
      this.log.error({ err: error, key }, 'Failed to initialize upload')
      throw Errors.S3_ERROR(
        this.getS3ErrorMessage(error, 'Failed to initialize multipart upload'),
      )
    }
  }

  async presignParts(
    key: string,
    uploadId: string,
    totalParts: number,
  ): Promise<PresignedPart[]> {
    return this.presignPartNumbers(key, uploadId, buildPartNumbers(totalParts))
  }

  async presignPartNumbers(
    key: string,
    uploadId: string,
    partNumbers: number[],
  ): Promise<PresignedPart[]> {
    try {
      const signed = await Promise.all(
        partNumbers.map(async (partNumber) => {
          const command = new UploadPartCommand({
            Bucket: this.bucket,
            Key: key,
            UploadId: uploadId,
            PartNumber: partNumber,
          })

          const url = await getSignedUrl(this.s3, command, {
            expiresIn: PRESIGNED_URL_TTL_SEC,
          })

          return {
            partNumber,
            url,
          }
        }),
      )

      return signed.sort((a, b) => a.partNumber - b.partNumber)
    } catch (error) {
      this.log.error({ err: error, key, uploadId }, 'Failed to presign parts')
      throw Errors.S3_ERROR(
        this.getS3ErrorMessage(error, 'Failed to generate presigned upload URLs'),
      )
    }
  }

  async completeUpload(key: string, uploadId: string, parts: PartRecord[]): Promise<void> {
    const completedParts: CompletedPart[] = parts
      .slice()
      .sort((a, b) => a.partNumber - b.partNumber)
      .map((part) => ({
        ETag: part.etag,
        PartNumber: part.partNumber,
      }))

    try {
      await this.s3.send(
        new CompleteMultipartUploadCommand({
          Bucket: this.bucket,
          Key: key,
          UploadId: uploadId,
          MultipartUpload: {
            Parts: completedParts,
          },
        }),
      )
    } catch (error) {
      this.log.error({ err: error, key, uploadId }, 'Failed to complete upload')
      throw Errors.S3_ERROR(
        this.getS3ErrorMessage(error, 'Failed to complete multipart upload'),
      )
    }
  }

  async abortUpload(key: string, uploadId: string): Promise<void> {
    try {
      await this.s3.send(
        new AbortMultipartUploadCommand({
          Bucket: this.bucket,
          Key: key,
          UploadId: uploadId,
        }),
      )
    } catch (error) {
      const err = error as { name?: string }
      if (err.name === 'NoSuchUpload') {
        return
      }
      this.log.error({ err: error, key, uploadId }, 'Failed to abort upload')
      throw Errors.S3_ERROR(
        this.getS3ErrorMessage(error, 'Failed to abort multipart upload'),
      )
    }
  }

  async listCompletedParts(key: string, uploadId: string): Promise<PartRecord[]> {
    const allParts: PartRecord[] = []
    let nextPartNumberMarker: string | undefined
    let isTruncated = true

    try {
      while (isTruncated) {
        const response = await this.s3.send(
          new ListPartsCommand({
            Bucket: this.bucket,
            Key: key,
            UploadId: uploadId,
            PartNumberMarker: nextPartNumberMarker,
          }),
        )

        const pageParts = (response.Parts ?? [])
          .filter((part): part is { PartNumber: number; ETag: string } => {
            return typeof part.PartNumber === 'number' && typeof part.ETag === 'string'
          })
          .map((part) => ({
            partNumber: part.PartNumber,
            etag: part.ETag,
          }))

        allParts.push(...pageParts)
        isTruncated = response.IsTruncated === true
        nextPartNumberMarker = response.NextPartNumberMarker
      }

      return allParts.sort((a, b) => a.partNumber - b.partNumber)
    } catch (error) {
      this.log.error({ err: error, key, uploadId }, 'Failed to list completed parts')
      throw Errors.S3_ERROR(
        this.getS3ErrorMessage(error, 'Failed to list completed upload parts'),
      )
    }
  }

  async downloadToBuffer(key: string): Promise<Buffer> {
    try {
      const response = await this.s3.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      )

      if (!response.Body) {
        throw Errors.S3_ERROR('S3 object body is empty')
      }

      const chunks: Buffer[] = []
      const sink = new Writable({
        write(chunk, _encoding, callback) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
          callback()
        },
      })

      await pipeline(response.Body as Readable, sink)
      return Buffer.concat(chunks)
    } catch (error) {
      this.log.error({ err: error, key }, 'Failed to download object')
      if (error instanceof Error && error.name === 'AppError') {
        throw error
      }
      throw Errors.S3_ERROR(
        this.getS3ErrorMessage(error, 'Failed to download object from storage'),
      )
    }
  }

  async uploadBuffer(key: string, buffer: Buffer, mimeType: string): Promise<void> {
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: buffer,
          ContentType: mimeType,
          CacheControl: 'public, max-age=31536000, immutable',
        }),
      )
    } catch (error) {
      this.log.error({ err: error, key }, 'Failed to upload object')
      throw Errors.S3_ERROR(
        this.getS3ErrorMessage(error, 'Failed to upload processed object'),
      )
    }
  }

  private getS3ErrorMessage(error: unknown, prefix: string): string {
    if (error instanceof Error) {
      const code = 'name' in error && typeof error.name === 'string' ? error.name : 'UnknownError'
      const message = error.message.length > 0 ? error.message : 'Unknown error'
      return `${prefix}: ${code} - ${message}`
    }

    return prefix
  }
}

export const multipartService = new MultipartService()
