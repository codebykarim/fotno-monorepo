export const IMAGE_POLICY = {
  PREVIEW_MAX_BYTES: 1_000_000,
  ALLOW_PROXY_VARIANTS: new Set(["thumbnail", "preview"]),
} as const;

export const PROTECTED_IMAGE_HEADERS: Record<string, string> = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Referrer-Policy": "no-referrer",
};
