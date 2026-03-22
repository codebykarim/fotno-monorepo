import * as Sentry from "@sentry/node";

type ExtraData = Record<string, string | number | boolean | undefined | null>;

// ─── Detailed Span (for priority flows) ─────────────────────────────────────

/**
 * Wrap an async operation in a Sentry span with detailed attributes.
 * Used for high-priority flows: gallery CRUD, billing, downloads, etc.
 */
export async function withSpan<T>(
  operation: string,
  data: ExtraData,
  fn: () => Promise<T>,
): Promise<T> {
  return Sentry.startSpan(
    { name: operation, op: operation.split(".")[0], attributes: cleanData(data) },
    async () => {
      Sentry.addBreadcrumb({
        category: operation.split(".")[0],
        message: operation,
        data: cleanData(data),
        level: "info",
      });
      return fn();
    },
  );
}

// ─── Error Capture Helpers ──────────────────────────────────────────────────

/**
 * Capture an error with full context for priority flows.
 * Includes tags, extra data, and breadcrumbs.
 */
export function captureWithContext(
  error: unknown,
  context: {
    operation: string;
    userId?: string;
    data?: ExtraData;
  },
): void {
  Sentry.withScope((scope) => {
    scope.setTag("operation", context.operation);
    scope.setTag("flow", context.operation.split(".")[0]);
    if (context.userId) {
      scope.setUser({ id: context.userId });
    }
    if (context.data) {
      scope.setExtras(cleanData(context.data));
    }
    Sentry.captureException(error);
  });
}

/**
 * Capture a simple error without detailed context.
 * Used for non-priority flows.
 */
export function captureError(error: unknown, tag?: string): void {
  Sentry.withScope((scope) => {
    if (tag) scope.setTag("source", tag);
    Sentry.captureException(error);
  });
}

// ─── Breadcrumbs ────────────────────────────────────────────────────────────

/**
 * Add a breadcrumb trail for debugging.
 */
export function addBreadcrumb(
  category: string,
  message: string,
  data?: ExtraData,
): void {
  Sentry.addBreadcrumb({
    category,
    message,
    data: data ? cleanData(data) : undefined,
    level: "info",
  });
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function cleanData(data: ExtraData): Record<string, string | number | boolean> {
  const cleaned: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined && v !== null) cleaned[k] = v;
  }
  return cleaned;
}
