import { z } from 'zod'

// Legacy backend IDs are UUIDs; new clients may send CUIDs.
const IdSchema = z.string().cuid().or(z.string().uuid())

// ─── Zod Schemas ───────────────────────────────────────────────────────────────

export const BatchInitFileSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(1),
  size: z.number().int().positive().max(500 * 1024 * 1024),
  checksum: z.string().length(64), // SHA-256 hex
})

export const BatchInitBodySchema = z.object({
  galleryId: IdSchema,
  files: z.array(BatchInitFileSchema).min(1).max(500),
})

export const PartCompleteBodySchema = z.object({
  photoId: IdSchema,
  partNumber: z.number().int().min(1).max(10000),
  etag: z.string().min(1),
})

export const ConfirmBodySchema = z.object({
  photoId: IdSchema,
})

export const AbortBodySchema = z.object({
  photoId: IdSchema,
})

// ─── TypeScript Interfaces ──────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  email: string
  plan: string
}

export interface PartRecord {
  partNumber: number
  etag: string
}

export interface PresignedPart {
  partNumber: number
  url: string
}

export interface BatchInitFileResult {
  photoId: string
  uploadId: string
  totalParts: number
  presignedParts: PresignedPart[]
  duplicate: boolean
  error?: string
}

export interface BatchInitResponse {
  results: BatchInitFileResult[]
  storageWarning?: 'approaching_limit' | 'over_limit'
}

export interface StorageSummary {
  used: bigint
  limit: bigint
  reserved: bigint
  overageBytes: bigint
  percentage: number
  canUpload: boolean
  isPaidPlan: boolean
  formatted: {
    used: string
    limit: string
    overage: string
  }
}

export interface ProcessingResult {
  thumbnail: { s3Key: string; size: bigint; width: number; height: number }
  preview: { s3Key: string; size: bigint; width: number; height: number }
}

export interface StorageGuardDecision {
  allowed: boolean
  isPaid: boolean
  warning?: 'approaching_limit' | 'over_limit'
}

// ─── BullMQ Job Payloads ────────────────────────────────────────────────────────

export interface ProcessPhotoJobData {
  photoId: string
  userId: string
  s3Key: string
  s3Bucket: string
}

export interface CleanupJobData {
  batchSize?: number
}
