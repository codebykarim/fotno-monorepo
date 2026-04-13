import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
  reactStrictMode: true,
  transpilePackages: ["@workspace/ui", "@workspace/lib"],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
