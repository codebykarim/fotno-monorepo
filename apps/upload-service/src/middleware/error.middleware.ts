import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../errors/index'
import { logger } from '../utils/logger'

const log = logger.child({ module: 'error.middleware' })

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  void next

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
      meta: err.meta,
    })
    return
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      issues: err.issues,
    })
    return
  }

  const unknownError = err instanceof Error ? err : new Error('Unknown error')
  log.error({ err: unknownError }, 'Unhandled error')

  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'Something went wrong',
  })
}
