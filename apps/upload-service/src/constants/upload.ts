export const CHUNK_SIZE_BYTES = 10 * 1024 * 1024 // 10MB per chunk
export const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024 // 500MB max per file
export const MAX_CONCURRENT_FILES = 4
export const MAX_CONCURRENT_CHUNKS = 3 // per file
export const PRESIGNED_URL_TTL_SEC = 7200 // 2 hours
export const UPLOAD_SESSION_TTL_HRS = 24
export const MAX_FILES_PER_BATCH = 500
export const PROCESSOR_CONCURRENCY = 4

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

export const RAW_MIME_TYPES = new Set([
  'image/x-canon-cr2',
  'image/x-canon-cr3',
  'image/x-sony-arw',
  'image/x-nikon-nef',
  'image/x-adobe-dng',
  'image/x-panasonic-raw',
])
