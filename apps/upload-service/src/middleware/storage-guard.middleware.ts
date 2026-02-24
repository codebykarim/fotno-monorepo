import type { NextFunction, Request, Response } from 'express'
import { Errors } from '../errors/index'
import { storageService } from '../services/storage'

function getTotalBytes(req: Request): bigint {
  const body = req.body as { files?: unknown }
  const files = Array.isArray(body.files) ? body.files : []

  return files.reduce<bigint>((sum, file) => {
    if (typeof file !== 'object' || file === null || !('size' in file)) {
      return sum
    }

    const size = (file as { size?: unknown }).size
    if (typeof size !== 'number' || !Number.isFinite(size) || size <= 0) {
      return sum
    }

    return sum + BigInt(Math.floor(size))
  }, 0n)
}

export async function storageGuardMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id

    if (!userId) {
      next(Errors.UNAUTHORIZED())
      return
    }

    const totalBytes = getTotalBytes(req)
    const decision = await storageService.canUpload(userId, totalBytes)

    req.storageGuard = decision

    if (!decision.allowed && !decision.isPaid) {
      const summary = await storageService.getSummary(userId)
      next(
        Errors.STORAGE_LIMIT_EXCEEDED(summary.formatted.used, summary.formatted.limit),
      )
      return
    }

    next()
  } catch (error) {
    next(error)
  }
}
