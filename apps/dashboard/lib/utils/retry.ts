export type RetryOptions = {
  /** Max retry attempts after the initial try (default 2, so 3 total attempts). */
  maxRetries?: number;
  /** Base delay in ms for exponential backoff (default 1000). */
  baseDelayMs?: number;
  /** Maximum delay cap in ms (default 8000). */
  maxDelayMs?: number;
  /** Custom predicate to decide if an error is retryable. */
  isRetryable?: (error: unknown) => boolean;
  /** Called before each retry with the attempt number (1-indexed) and the error. */
  onRetry?: (attempt: number, error: unknown) => void;
};

/** Returns true for transient errors that are safe to retry. */
function defaultIsRetryable(error: unknown): boolean {
  // Never retry user-initiated aborts
  if (error instanceof DOMException && error.name === "AbortError") return false;
  if (error instanceof Error && error.name === "AbortError") return false;

  // Network failures (no response at all)
  if (error instanceof TypeError) return true;

  // HTTP status-based errors
  if (error && typeof error === "object" && "status" in error) {
    const status = (error as { status: number }).status;
    // Retry on 429 (rate-limited) and 5xx (server errors)
    if (status === 429 || status >= 500) return true;
    // Don't retry 4xx client errors
    return false;
  }

  // Unknown errors — retry conservatively
  return true;
}

/**
 * Wraps an async function with automatic retry + exponential backoff.
 * Only retries on transient errors (network failures, 5xx, 429).
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions,
): Promise<T> {
  const maxRetries = options?.maxRetries ?? 2;
  const baseDelayMs = options?.baseDelayMs ?? 1000;
  const maxDelayMs = options?.maxDelayMs ?? 8000;
  const isRetryable = options?.isRetryable ?? defaultIsRetryable;
  const onRetry = options?.onRetry;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt >= maxRetries || !isRetryable(error)) {
        throw error;
      }

      const delay = Math.min(baseDelayMs * 2 ** attempt, maxDelayMs);
      onRetry?.(attempt + 1, error);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
