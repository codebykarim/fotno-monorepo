import type { NextConfig } from "next";
import path from "path";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
  reactStrictMode: true,
  transpilePackages: ["@workspace/ui"],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "picsum.photos",
      },
      {
        hostname: "f219b79935cbb2d4a385b4134443cbe1.r2.cloudflarestorage.com",
      },
      {
        hostname: "d2ze6wzywpso1l.cloudfront.net"
      }
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT_DASHBOARD,

  // Only upload source maps in CI
  silent: !process.env.CI,

  // Widen client-side file uploads for better stack traces
  widenClientFileUpload: true,

  // Tree-shake Sentry logger in production
  disableLogger: true,
});
