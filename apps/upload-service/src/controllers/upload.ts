import { randomUUID } from 'node:crypto'
import path from 'node:path'
import type { NextFunction, Request, Response } from 'express'
import { Prisma, prisma } from '@workspace/db'
import {
  AbortBodySchema,
  BatchInitBodySchema,
  ConfirmBodySchema,
  PartCompleteBodySchema,
  type BatchInitFileResult,
  type BatchInitResponse,
  type PartRecord,
} from '../interfaces/index'
import { multipartService } from '../services/multipart'
import { storageService } from '../services/storage'
import { dedupService } from '../services/dedup'
import { Errors } from '../errors/index'
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILES_PER_BATCH,
  UPLOAD_SESSION_TTL_HRS,
} from '../constants/upload'
import { env } from '../constants/env'
import { logger } from '../utils/logger'
import { calculateTotalParts } from '../utils/chunks'

const log = logger.child({ module: 'upload.controller' })

/** Sanitizes filename for safe use in S3 keys: strips path and replaces unsafe chars with underscore. */
function sanitizeFilename(filename: string): string {
  const base = path.basename(filename)
  return base.replace(/[^a-zA-Z0-9._-]/g, '_')
}

/** Parses the stored completedParts JSON into PartRecord array. Validates structure. */
function parseCompletedParts(value: unknown): PartRecord[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((part) => {
      if (typeof part !== 'object' || part === null) {
        return null
      }

      const candidate = part as { partNumber?: unknown; etag?: unknown }
      if (
        typeof candidate.partNumber !== 'number' ||
        !Number.isInteger(candidate.partNumber) ||
        candidate.partNumber < 1 ||
        typeof candidate.etag !== 'string' ||
        candidate.etag.length === 0
      ) {
        return null
      }

      return {
        partNumber: candidate.partNumber,
        etag: candidate.etag,
      }
    })
    .filter((part): part is PartRecord => part !== null)
}

/**
 * Handles multipart upload lifecycle: batch-init (presign), part-complete, confirm, abort.
 * Called by the backend via uploadServiceRequest. Creates photo + uploadSession records,
 * reserves storage, deduplicates by checksum, and enqueues process-photo on confirm.
 */
export class UploadController {
  /** Initializes multipart uploads for one or more files. Returns presigned URLs, photo IDs, and dedupe info. */
  async batchInit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = BatchInitBodySchema.parse(req.body)

      if (body.files.length > MAX_FILES_PER_BATCH) {
        throw Errors.BATCH_TOO_LARGE(MAX_FILES_PER_BATCH)
      }

      const userId = req.user.id
      const gallery = await prisma.gallery.findFirst({
        where: {
          id: body.galleryId,
          userId,
        },
        select: {
          id: true,
        },
      })

      if (!gallery) {
        throw Errors.GALLERY_NOT_FOUND()
      }

      const checksums = body.files.map((file) => file.checksum)
      const duplicateMap = await dedupService.filterDuplicates(body.galleryId, checksums)

      const totalNewBytes = body.files.reduce((sum, file) => {
        if (duplicateMap.has(file.checksum)) {
          return sum
        }
        return sum + BigInt(file.size)
      }, 0n)

      const storageDecision = req.storageGuard ?? (await storageService.canUpload(userId, totalNewBytes))
      if (!storageDecision.allowed && !storageDecision.isPaid) {
        const summary = await storageService.getSummary(userId)
        throw Errors.STORAGE_LIMIT_EXCEEDED(summary.formatted.used, summary.formatted.limit)
      }

      const latestPhoto = await prisma.photo.findFirst({
        where: {
          galleryId: body.galleryId,
        },
        orderBy: {
          order: 'desc',
        },
        select: {
          order: true,
        },
      })

      const baseOrder = latestPhoto?.order ?? -1

      const results = await Promise.allSettled(
        body.files.map((file, index) =>
          this.initializeSingleUpload({
            file,
            galleryId: body.galleryId,
            userId,
            duplicatePhotoId: duplicateMap.get(file.checksum),
            order: baseOrder + index + 1,
          }),
        ),
      )

      const normalizedResults: BatchInitFileResult[] = results.map((result) => {
        if (result.status === 'fulfilled') {
          return result.value
        }

        const reason = result.reason instanceof Error ? result.reason.message : 'Failed to initialize upload'
        return {
          photoId: '',
          uploadId: '',
          totalParts: 0,
          presignedParts: [],
          duplicate: false,
          error: reason,
        }
      })

      const response: BatchInitResponse = {
        results: normalizedResults,
        storageWarning: storageDecision.warning,
      }

      res.status(201).json(response)
    } catch (error) {
      next(error)
    }
  }

  /** Records that a multipart chunk was uploaded. Merges etag into session.completedParts. */
  async partComplete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = PartCompleteBodySchema.parse(req.body)
      const userId = req.user.id

      const photo = await prisma.photo.findFirst({
        where: {
          id: body.photoId,
          gallery: {
            userId,
          },
        },
        select: {
          id: true,
        },
      })

      if (!photo) {
        throw Errors.PHOTO_NOT_FOUND()
      }

      const session = await prisma.uploadSession.findUnique({
        where: { photoId: body.photoId },
      })

      if (!session) {
        throw Errors.SESSION_NOT_FOUND()
      }

      if (session.status !== 'IN_PROGRESS') {
        throw Errors.SESSION_ALREADY_DONE()
      }

      const completedParts = parseCompletedParts(session.completedParts)
      const deduped = new Map<number, PartRecord>()
      for (const part of completedParts) {
        deduped.set(part.partNumber, part)
      }
      deduped.set(body.partNumber, {
        partNumber: body.partNumber,
        etag: body.etag,
      })

      const nextParts = Array.from(deduped.values()).sort(
        (a, b) => a.partNumber - b.partNumber,
      )

      await prisma.uploadSession.update({
        where: { id: session.id },
        data: {
          completedParts: nextParts as unknown as Prisma.InputJsonValue,
        },
      })

      res.json({
        completedCount: nextParts.length,
        totalParts: session.totalParts,
        isComplete: nextParts.length === session.totalParts,
      })
    } catch (error) {
      next(error)
    }
  }

  /** Completes the multipart upload on S3, marks photo as uploaded, confirms storage reservation, enqueues processing. */
  async confirm(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = ConfirmBodySchema.parse(req.body)
      const userId = req.user.id

      const photo = await prisma.photo.findFirst({
        where: {
          id: body.photoId,
          gallery: {
            userId,
          },
        },
        select: {
          id: true,
          s3Bucket: true,
        },
      })

      if (!photo) {
        throw Errors.PHOTO_NOT_FOUND()
      }

      const session = await prisma.uploadSession.findUnique({
        where: {
          photoId: body.photoId,
        },
      })

      if (!session) {
        throw Errors.SESSION_NOT_FOUND()
      }

      if (session.status !== 'IN_PROGRESS') {
        throw Errors.SESSION_ALREADY_DONE()
      }

      const completedParts = parseCompletedParts(session.completedParts)
      if (completedParts.length !== session.totalParts) {
        throw Errors.PARTS_INCOMPLETE(completedParts.length, session.totalParts)
      }

      await multipartService.completeUpload(session.s3Key, session.s3UploadId, completedParts)

      await prisma.$transaction(async (tx) => {
        await tx.uploadSession.update({
          where: { id: session.id },
          data: { status: 'COMPLETED' },
        })

        await tx.photo.update({
          where: { id: photo.id },
          data: {
            status: 'uploaded',
            originalSize: session.totalSize,
          },
        })
      })

      await storageService.confirmReservation(userId, photo.id, session.totalSize)

      // Photo is now status: "uploaded" — the image-processor service
      // will pick it up via DB polling and process it via Lambda

      res.json({
        success: true,
        photo: {
          id: photo.id,
          status: 'uploaded',
          originalSize: session.totalSize.toString(),
        },
      })
    } catch (error) {
      next(error)
    }
  }

  /** Aborts an in-progress upload, deletes the photo record, and releases storage reservation. */
  async abort(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = AbortBodySchema.parse(req.body)
      const userId = req.user.id

      const photo = await prisma.photo.findFirst({
        where: {
          id: body.photoId,
          gallery: {
            userId,
          },
        },
        select: {
          id: true,
        },
      })

      if (!photo) {
        throw Errors.PHOTO_NOT_FOUND()
      }

      const session = await prisma.uploadSession.findUnique({
        where: {
          photoId: body.photoId,
        },
      })

      if (!session) {
        throw Errors.SESSION_NOT_FOUND()
      }

      if (session.status !== 'IN_PROGRESS') {
        throw Errors.SESSION_ALREADY_DONE()
      }

      await multipartService.abortUpload(session.s3Key, session.s3UploadId)

      await prisma.$transaction(async (tx) => {
        await tx.uploadSession.update({
          where: { id: session.id },
          data: {
            status: 'ABORTED',
          },
        })

        await tx.photo.delete({
          where: {
            id: photo.id,
          },
        })
      })

      await storageService.releaseReservation(userId, session.totalSize)

      res.json({ success: true })
    } catch (error) {
      next(error)
    }
  }

  /** Initializes one file's multipart upload: creates photo + session, presigns parts, reserves storage. */
  private async initializeSingleUpload(params: {
    file: {
      filename: string
      mimeType: string
      size: number
      checksum: string
    }
    galleryId: string
    userId: string
    duplicatePhotoId?: string
    order: number
  }): Promise<BatchInitFileResult> {
    const { file, galleryId, userId, duplicatePhotoId, order } = params

    if (duplicatePhotoId) {
      return {
        photoId: duplicatePhotoId,
        uploadId: '',
        totalParts: 0,
        presignedParts: [],
        duplicate: true,
      }
    }

    if (!ALLOWED_MIME_TYPES.has(file.mimeType)) {
      throw Errors.INVALID_MIME_TYPE(file.mimeType)
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw Errors.FILE_TOO_LARGE(file.size, MAX_FILE_SIZE_BYTES)
    }

    const totalParts = calculateTotalParts(file.size)
    const photoId = randomUUID()
    const s3Key = multipartService.buildOriginalKey(
      galleryId,
      photoId,
      sanitizeFilename(file.filename),
    )

    let uploadId = ''
    let reserved = false

    try {
      uploadId = await multipartService.initUpload(s3Key, file.mimeType)
      const presignedParts = await multipartService.presignParts(
        s3Key,
        uploadId,
        totalParts,
      )

      await prisma.$transaction(async (tx) => {
        await tx.photo.create({
          data: {
            id: photoId,
            galleryId,
            s3Key,
            s3Bucket: env.AWS_S3_BUCKET,
            originalFilename: file.filename,
            mimeType: file.mimeType,
            originalSize: BigInt(file.size),
            checksum: file.checksum,
            status: 'pending',
            order,
          },
        })

        await tx.uploadSession.create({
          data: {
            photoId,
            s3UploadId: uploadId,
            s3Key,
            totalParts,
            totalSize: BigInt(file.size),
            completedParts: [] as Prisma.InputJsonValue,
            status: 'IN_PROGRESS',
            expiresAt: new Date(Date.now() + UPLOAD_SESSION_TTL_HRS * 60 * 60 * 1000),
          },
        })
      })

      await storageService.reserveStorage(userId, BigInt(file.size))
      reserved = true

      return {
        photoId,
        uploadId,
        totalParts,
        presignedParts,
        duplicate: false,
      }
    } catch (error) {
      log.error({ err: error, photoId, userId }, 'Failed to initialize file upload')

      if (uploadId.length > 0) {
        await multipartService.abortUpload(s3Key, uploadId).catch(() => {
          // Best effort cleanup.
        })
      }

      await prisma.$transaction(async (tx) => {
        await tx.uploadSession
          .deleteMany({
            where: {
              photoId,
            },
          })
          .catch(() => {
            // Session may not exist.
          })

        await tx.photo
          .deleteMany({
            where: {
              id: photoId,
            },
          })
          .catch(() => {
            // Photo may not exist.
          })
      })

      if (reserved) {
        await storageService.releaseReservation(userId, BigInt(file.size)).catch(() => {
          // Reservation rollback is best effort.
        })
      }

      throw error
    }
  }
}

export const uploadController = new UploadController()
