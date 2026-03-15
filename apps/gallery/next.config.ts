import type { NextConfig } from "next";
import path from "path";

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

export default nextConfig;
