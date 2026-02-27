import type { NextFunction, Request, Response } from 'express'
import { Prisma, prisma } from '@workspace/db'
import { Errors } from '../errors/index'
import type { PartRecord } from '../interfaces/index'
import { multipartService } from '../services/multipart'
import { findMissingPartNumbers } from '../utils/chunks'
import { logger } from '../utils/logger'

const log = logger.child({ module: 'session.controller' })

/** Parses stored completedParts JSON into PartRecord array. */
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

/** Handles upload session listing for resume flows. */
export class SessionController {
  /** Returns all in-progress upload sessions for a gallery, with S3-synced completed parts and fresh presigned URLs for missing parts. */
  async getGallerySession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const galleryId = req.params.galleryId
      const userId = req.user.id

      const gallery = await prisma.gallery.findFirst({
        where: {
          id: galleryId,
          userId,
        },
        select: {
          id: true,
        },
      })

      if (!gallery) {
        throw Errors.GALLERY_NOT_FOUND()
      }

      const sessions = await prisma.uploadSession.findMany({
        where: {
          status: 'IN_PROGRESS',
          photo: {
            galleryId,
          },
        },
        include: {
          photo: {
            select: {
              id: true,
              originalFilename: true,
              mimeType: true,
              checksum: true,
              originalSize: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      })

      const hydrated = await Promise.all(
        sessions.map(async (session) => {
          const currentS3Parts = await multipartService.listCompletedParts(
            session.s3Key,
            session.s3UploadId,
          )

          const previous = parseCompletedParts(session.completedParts)
          const previousSerialized = JSON.stringify(previous)
          const currentSerialized = JSON.stringify(currentS3Parts)

          if (previousSerialized !== currentSerialized) {
            await prisma.uploadSession.update({
              where: { id: session.id },
              data: {
                completedParts: currentS3Parts as unknown as Prisma.InputJsonValue,
              },
            })
          }

          const missingPartNumbers = findMissingPartNumbers(
            session.totalParts,
            currentS3Parts.map((part) => part.partNumber),
          )

          const presignedParts =
            missingPartNumbers.length > 0
              ? await multipartService.presignPartNumbers(
                  session.s3Key,
                  session.s3UploadId,
                  missingPartNumbers,
                )
              : []

          return {
            photoId: session.photoId,
            uploadId: session.s3UploadId,
            s3Key: session.s3Key,
            filename: session.photo.originalFilename,
            mimeType: session.photo.mimeType,
            checksum: session.photo.checksum,
            totalSize: session.photo.originalSize.toString(),
            totalParts: session.totalParts,
            completedParts: currentS3Parts,
            missingParts: missingPartNumbers,
            presignedParts,
            expiresAt: session.expiresAt.toISOString(),
          }
        }),
      )

      res.json({ sessions: hydrated })
    } catch (error) {
      log.error({ err: error, galleryId: req.params.galleryId }, 'Failed to fetch session state')
      next(error)
    }
  }
}

export const sessionController = new SessionController()
