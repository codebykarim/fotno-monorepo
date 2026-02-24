import { prisma } from '@workspace/db'
import { PLAN_STORAGE_LIMITS } from '../constants/storage'
import { env } from '../constants/env'
import type { StorageSummary } from '../interfaces/index'
import { sendStorageWarningEmail } from '../utils/email'
import { formatBytes } from '../utils/format-bytes'
import { logger } from '../utils/logger'

const ONE_MB = 1024n * 1024n

function clampNonNegative(value: bigint): bigint {
  return value < 0n ? 0n : value
}

function absBigInt(value: bigint): bigint {
  return value < 0n ? -value : value
}

function resolveStorageLimit(plan: string, storageLimit: bigint): bigint {
  if (storageLimit > 0n) {
    return storageLimit
  }
  return PLAN_STORAGE_LIMITS[plan] ?? PLAN_STORAGE_LIMITS.FREE
}

class StorageService {
  private readonly log = logger.child({ module: 'storage.service' })

  async getSummary(userId: string): Promise<StorageSummary> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        storageUsed: true,
        storageLimit: true,
        storageReserved: true,
        overageBytes: true,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const used = clampNonNegative(user.storageUsed)
    const reserved = clampNonNegative(user.storageReserved)
    const limit = resolveStorageLimit(user.plan, clampNonNegative(user.storageLimit))
    const overageBytes = clampNonNegative(user.overageBytes)
    const percentage = limit > 0n ? Number((used * 100n) / limit) : 0
    const isPaidPlan = user.plan !== 'FREE'
    const canUpload = isPaidPlan ? true : used < limit

    return {
      used,
      limit,
      reserved,
      overageBytes,
      percentage,
      canUpload,
      isPaidPlan,
      formatted: {
        used: formatBytes(used),
        limit: formatBytes(limit),
        overage: formatBytes(overageBytes),
      },
    }
  }

  async canUpload(userId: string, bytes: bigint): Promise<{
    allowed: boolean
    isPaid: boolean
    warning?: 'approaching_limit' | 'over_limit'
  }> {
    const summary = await this.getSummary(userId)
    const requestedBytes = clampNonNegative(bytes)
    const projected = summary.used + summary.reserved + requestedBytes
    const isPaid = summary.isPaidPlan

    if (!isPaid) {
      return {
        allowed: projected <= summary.limit,
        isPaid: false,
      }
    }

    let warning: 'approaching_limit' | 'over_limit' | undefined
    if (summary.limit > 0n && projected > summary.limit) {
      warning = 'over_limit'
    } else if (summary.limit > 0n) {
      const pct = Number((projected * 100n) / summary.limit)
      if (pct >= 80) {
        warning = 'approaching_limit'
      }
    }

    return {
      allowed: true,
      isPaid: true,
      warning,
    }
  }

  async reserveStorage(userId: string, bytes: bigint): Promise<void> {
    const requested = clampNonNegative(bytes)

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({
        where: { id: userId },
        select: { storageReserved: true },
      })

      await tx.user.update({
        where: { id: userId },
        data: {
          storageReserved: clampNonNegative(user.storageReserved + requested),
        },
      })
    })
  }

  async confirmReservation(userId: string, photoId: string, bytes: bigint): Promise<void> {
    const uploadedBytes = clampNonNegative(bytes)

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          plan: true,
          storageUsed: true,
          storageReserved: true,
          storageLimit: true,
        },
      })

      const nextReserved = clampNonNegative(user.storageReserved - uploadedBytes)
      const nextUsed = clampNonNegative(user.storageUsed + uploadedBytes)
      const limit = resolveStorageLimit(user.plan, clampNonNegative(user.storageLimit))
      const nextOverage = nextUsed > limit ? nextUsed - limit : 0n

      await tx.user.update({
        where: { id: userId },
        data: {
          storageReserved: nextReserved,
          storageUsed: nextUsed,
          overageBytes: nextOverage,
        },
      })

      await tx.storageEvent.create({
        data: {
          userId,
          photoId,
          delta: uploadedBytes,
          reason: 'upload',
        },
      })
    })

    await this.checkWarningThresholds(userId)
  }

  async releaseReservation(userId: string, bytes: bigint): Promise<void> {
    const releasedBytes = clampNonNegative(bytes)

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({
        where: { id: userId },
        select: { storageReserved: true },
      })

      await tx.user.update({
        where: { id: userId },
        data: {
          storageReserved: clampNonNegative(user.storageReserved - releasedBytes),
        },
      })

      await tx.storageEvent.create({
        data: {
          userId,
          delta: -releasedBytes,
          reason: 'reservation_released',
        },
      })
    })
  }

  async addProcessedStorage(
    userId: string,
    photoId: string,
    thumbnailSize: bigint,
    previewSize: bigint,
  ): Promise<void> {
    const delta = clampNonNegative(thumbnailSize) + clampNonNegative(previewSize)

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          plan: true,
          storageUsed: true,
          storageLimit: true,
        },
      })

      const nextUsed = clampNonNegative(user.storageUsed + delta)
      const limit = resolveStorageLimit(user.plan, clampNonNegative(user.storageLimit))
      const nextOverage = nextUsed > limit ? nextUsed - limit : 0n

      await tx.user.update({
        where: { id: userId },
        data: {
          storageUsed: nextUsed,
          overageBytes: nextOverage,
        },
      })

      await tx.storageEvent.create({
        data: {
          userId,
          photoId,
          delta,
          reason: 'processing',
        },
      })
    })

    await this.checkWarningThresholds(userId)
  }

  async removeStorage(userId: string, photoId: string, totalSize: bigint): Promise<void> {
    const bytes = clampNonNegative(totalSize)

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          storageUsed: true,
          overageBytes: true,
        },
      })

      const overageToRemove = user.overageBytes >= bytes ? bytes : user.overageBytes
      const remainingRemoval = bytes - overageToRemove
      const nextOverage = clampNonNegative(user.overageBytes - overageToRemove)
      const nextUsed = clampNonNegative(user.storageUsed - remainingRemoval)

      await tx.user.update({
        where: { id: userId },
        data: {
          storageUsed: nextUsed,
          overageBytes: nextOverage,
        },
      })

      await tx.storageEvent.create({
        data: {
          userId,
          photoId,
          delta: -bytes,
          reason: 'delete',
        },
      })
    })
  }

  async reconcile(
    userId: string,
  ): Promise<{ before: bigint; after: bigint; delta: bigint }> {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        plan: true,
        storageUsed: true,
        storageLimit: true,
      },
    })

    const before = clampNonNegative(user.storageUsed)

    const rows = await prisma.$queryRaw<Array<{ total: bigint }>>`
      SELECT COALESCE(SUM(p."totalSize"), 0)::bigint AS total
      FROM "photo" p
      JOIN "gallery" g ON g."id" = p."galleryId"
      WHERE g."userId" = ${userId}
        AND p."status" = 'processed'
    `

    const after = clampNonNegative(rows[0]?.total ?? 0n)
    const delta = after - before

    if (absBigInt(delta) > ONE_MB) {
      await prisma.$transaction(async (tx) => {
        const limit = resolveStorageLimit(user.plan, clampNonNegative(user.storageLimit))
        const nextOverage = after > limit ? after - limit : 0n

        await tx.user.update({
          where: { id: userId },
          data: {
            storageUsed: after,
            overageBytes: nextOverage,
          },
        })

        await tx.storageEvent.create({
          data: {
            userId,
            delta,
            reason: 'reconcile',
          },
        })
      })
    }

    return { before, after, delta }
  }

  private async checkWarningThresholds(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
        plan: true,
        storageUsed: true,
        storageLimit: true,
        warningEmailSent80: true,
        warningEmailSent95: true,
      },
    })

    if (!user || !user.email) {
      return
    }

    const limit = resolveStorageLimit(user.plan, clampNonNegative(user.storageLimit))
    if (limit <= 0n) {
      return
    }

    const used = clampNonNegative(user.storageUsed)
    const pct = Number((used * 100n) / limit)
    const upgradeUrl = `${env.NEXT_PUBLIC_DASHBOARD_URL ?? 'https://dashboard.fotno.com'}/billing`

    try {
      if (pct >= 95 && !user.warningEmailSent95) {
        await sendStorageWarningEmail({
          to: user.email,
          name: user.name,
          used,
          limit,
          percentage: pct,
          level: 95,
          upgradeUrl,
        })

        await prisma.user.update({
          where: { id: userId },
          data: { warningEmailSent95: true },
        })
        return
      }

      if (pct >= 80 && !user.warningEmailSent80) {
        await sendStorageWarningEmail({
          to: user.email,
          name: user.name,
          used,
          limit,
          percentage: pct,
          level: 80,
          upgradeUrl,
        })

        await prisma.user.update({
          where: { id: userId },
          data: { warningEmailSent80: true },
        })
      }
    } catch (error) {
      this.log.error({ err: error, userId }, 'Failed to send storage warning email')
    }
  }
}

export const storageService = new StorageService()
