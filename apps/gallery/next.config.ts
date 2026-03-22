import type { NextConfig } from "next";
import path from "path";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
  transpilePackages: ["@workspace/ui"],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`, // Your Express server URL
  //     },
  //   ];
  // },
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      {
        pathname: "/api/photos/**",
      },
      {
        pathname: "/logo.png"
      }
    ],
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "f219b79935cbb2d4a385b4134443cbe1.r2.cloudflarestorage.com",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT_GALLERY,

  // Only upload source maps in CI
  silent: !process.env.CI,

  // Widen client-side file uploads for better stack traces
  widenClientFileUpload: true,

  // Tree-shake Sentry logger in production
  disableLogger: true,
});
