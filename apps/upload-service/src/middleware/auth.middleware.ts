import type { NextFunction, Request, Response } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { env } from '../constants/env'
import { Errors } from '../errors/index'

interface UploadJwtPayload extends JwtPayload {
  sub?: string
  userId?: string
  email?: string
  plan?: string
  role?: string
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authorization = req.headers.authorization

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(Errors.UNAUTHORIZED())
    return
  }

  const token = authorization.slice('Bearer '.length).trim()

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)

    if (typeof decoded === 'string') {
      next(Errors.UNAUTHORIZED())
      return
    }

    const payload = decoded as UploadJwtPayload
    const userId = payload.sub ?? payload.userId

    if (!userId) {
      next(Errors.UNAUTHORIZED())
      return
    }

    if (payload.role && payload.role.toLowerCase() !== 'photographer') {
      next(Errors.FORBIDDEN())
      return
    }

    req.user = {
      id: userId,
      email: payload.email ?? '',
      plan: payload.plan ?? 'FREE',
    }

    next()
  } catch {
    next(Errors.UNAUTHORIZED())
  }
}
