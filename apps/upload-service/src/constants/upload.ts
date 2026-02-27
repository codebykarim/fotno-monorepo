import { env } from './env'

/**
 * Upload and processing constants. Tunables come from environment variables (see env.ts).
 * To scale: increase PROCESSOR_CONCURRENCY per worker and/or run more worker instances.
 * Effective throughput = PROCESSOR_CONCURRENCY × number_of_worker_processes.
 */

/** Size of each multipart chunk. Files larger than this are split into multiple parts. */
export const CHUNK_SIZE_BYTES = env.CHUNK_SIZE_BYTES
/** Maximum allowed file size for uploads. Files larger than this are rejected. */
export const MAX_FILE_SIZE_BYTES = env.MAX_FILE_SIZE_BYTES
/** Recommended max files to upload concurrently per client. Used for client-side guidance. */
export const MAX_CONCURRENT_FILES = 4
/** Recommended max chunks (parts) to upload concurrently per file. Reduces presigned URL waste. */
export const MAX_CONCURRENT_CHUNKS = 3
/** How long presigned part URLs remain valid (seconds). */
export const PRESIGNED_URL_TTL_SEC = env.PRESIGNED_URL_TTL_SEC
/** Hours before an in-progress upload session expires and is cleaned up. */
export const UPLOAD_SESSION_TTL_HRS = env.UPLOAD_SESSION_TTL_HRS
/** Max files allowed in a single batch-init request. */
export const MAX_FILES_PER_BATCH = env.MAX_FILES_PER_BATCH
/** Number of process-photo jobs a single worker handles in parallel. */
export const PROCESSOR_CONCURRENCY = env.PROCESSOR_CONCURRENCY

/** MIME types accepted for photo uploads. Non-matching types are rejected. */
export const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/tiff',
  'image/x-canon-cr2',
  'image/x-canon-cr3',
  'image/x-sony-arw',
  'image/x-nikon-nef',
  'image/x-adobe-dng',
  'image/x-panasonic-raw',
])

/** RAW camera formats that need embedded-preview extraction before thumbnail/preview generation. */
export const RAW_MIME_TYPES = new Set([
  'image/x-canon-cr2',
  'image/x-canon-cr3',
  'image/x-sony-arw',
  'image/x-nikon-nef',
  'image/x-adobe-dng',
  'image/x-panasonic-raw',
])
