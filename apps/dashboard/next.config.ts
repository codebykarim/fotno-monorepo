import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
};

export default nextConfig;
