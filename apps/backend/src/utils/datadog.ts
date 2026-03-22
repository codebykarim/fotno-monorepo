import tracer from "../datadog";
import type { Span } from "dd-trace";

// ─── Custom Span Helpers ────────────────────────────────────────────────────

type SpanTags = Record<string, string | number | boolean | undefined>;

/**
 * Run an async function inside a custom Datadog span with detailed tags.
 * Used for high-priority business operations (gallery, billing, etc.)
 */
export async function withDetailedSpan<T>(
  operationName: string,
  tags: SpanTags,
  fn: (span: Span) => Promise<T>,
): Promise<T> {
  return tracer.trace(operationName, { tags: cleanTags(tags) }, async (span: any) => {
    try {
      const result = await fn(span);
      span?.setTag("result.success", true);
      return result;
    } catch (error) {
      if (span) tagSpanError(span, error);
      throw error;
    }
  });
}

/**
 * Run an async function inside a lightweight span (less detail).
 * Used for general/non-priority operations.
 */
export async function withSpan<T>(
  operationName: string,
  fn: (span: Span) => Promise<T>,
): Promise<T> {
  return tracer.trace(operationName, async (span: any) => {
    try {
      const result = await fn(span);
      return result;
    } catch (error) {
      span?.setTag("error", true);
      if (error instanceof Error) {
        span?.setTag("error.message", error.message);
      }
      throw error;
    }
  });
}

// ─── Error Tracking ─────────────────────────────────────────────────────────

/**
 * Tag a span with full error details for priority flows.
 */
function tagSpanError(span: Span, error: unknown): void {
  span.setTag("error", true);
  span.setTag("result.success", false);
  if (error instanceof Error) {
    span.setTag("error.type", error.constructor.name);
    span.setTag("error.message", error.message);
    span.setTag("error.stack", error.stack ?? "");
  }
}

/**
 * Report a non-throwing error/warning to Datadog via the active span.
 */
export function reportError(error: unknown, tags?: SpanTags): void {
  const span = tracer.scope().active();
  if (!span) return;
  span.setTag("error", true);
  if (error instanceof Error) {
    span.setTag("error.type", error.constructor.name);
    span.setTag("error.message", error.message);
  }
  if (tags) {
    for (const [k, v] of Object.entries(cleanTags(tags))) {
      span.setTag(k, v);
    }
  }
}

// ─── Custom Metrics ─────────────────────────────────────────────────────────

const metrics = tracer.dogstatsd;

export function incrementMetric(
  name: string,
  value = 1,
  tags?: string[],
): void {
  metrics.increment(`fotno.${name}`, value, tags);
}

export function gaugeMetric(
  name: string,
  value: number,
  tags?: string[],
): void {
  metrics.gauge(`fotno.${name}`, value, tags);
}

export function histogramMetric(
  name: string,
  value: number,
  tags?: string[],
): void {
  metrics.histogram(`fotno.${name}`, value, tags);
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function cleanTags(tags: SpanTags): Record<string, string | number | boolean> {
  const cleaned: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(tags)) {
    if (v !== undefined) cleaned[k] = v;
  }
  return cleaned;
}

/**
 * Get the active Datadog span (if any).
 */
export function activeSpan(): Span | null {
  return tracer.scope().active();
}

/**
 * Add tags to the currently active span.
 */
export function tagActiveSpan(tags: SpanTags): void {
  const span = tracer.scope().active();
  if (!span) return;
  for (const [k, v] of Object.entries(cleanTags(tags))) {
    span.setTag(k, v);
  }
}
