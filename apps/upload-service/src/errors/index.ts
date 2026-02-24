export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode: number,
    public readonly meta?: Record<string, unknown>,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const Errors = {
  VALIDATION: (issues?: unknown) =>
    new AppError('VALIDATION_ERROR', 'Invalid request body', 400, {
      issues,
    }),
  UNAUTHORIZED: () =>
    new AppError('UNAUTHORIZED', 'Authentication required', 401),
  FORBIDDEN: () => new AppError('FORBIDDEN', 'Access denied', 403),
  GALLERY_NOT_FOUND: () =>
    new AppError('GALLERY_NOT_FOUND', 'Gallery not found', 404),
  PHOTO_NOT_FOUND: () => new AppError('PHOTO_NOT_FOUND', 'Photo not found', 404),
  SESSION_NOT_FOUND: () =>
    new AppError('SESSION_NOT_FOUND', 'Upload session not found', 404),
  SESSION_ALREADY_DONE: () =>
    new AppError(
      'SESSION_ALREADY_DONE',
      'Upload already completed or aborted',
      409,
    ),
  PARTS_INCOMPLETE: (got: number, want: number) =>
    new AppError('PARTS_INCOMPLETE', `${got} of ${want} parts completed`, 409, {
      got,
      want,
    }),
  FILE_TOO_LARGE: (size: number, max: number) =>
    new AppError('FILE_TOO_LARGE', 'File exceeds maximum allowed size', 413, {
      size,
      max,
    }),
  INVALID_MIME_TYPE: (type: string) =>
    new AppError('INVALID_MIME_TYPE', `File type '${type}' is not allowed`, 415, {
      type,
    }),
  STORAGE_LIMIT_EXCEEDED: (used: string, limit: string) =>
    new AppError(
      'STORAGE_LIMIT_EXCEEDED',
      'Storage limit reached. Upgrade your plan.',
      403,
      { used, limit },
    ),
  S3_ERROR: (msg: string) => new AppError('S3_ERROR', msg, 502),
  PROCESSING_FAILED: (msg: string) =>
    new AppError('PROCESSING_FAILED', msg, 500),
  BATCH_TOO_LARGE: (max: number) =>
    new AppError('BATCH_TOO_LARGE', `Maximum ${max} files per batch`, 400, {
      max,
    }),
} as const
