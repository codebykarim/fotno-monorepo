export const IMAGE_POLICY = {
  PREVIEW_MAX_BYTES: 1_000_000,
  ALLOW_PROXY_VARIANTS: new Set(["thumbnail", "preview"]),
} as const;

export const PROTECTED_IMAGE_HEADERS: Record<string, string> = {
  // Thumbnails/previews are immutable generated files — cache aggressively.
  // The URL itself contains the photoId so content changes mean a new URL.
  "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
  "X-Content-Type-Options": "nosniff",
  "Cross-Origin-Resource-Policy": "cross-origin",
  "Referrer-Policy": "no-referrer",
};
