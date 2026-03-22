import "./polyfills/slowBuffer";
import dotenv from "dotenv";
import path from "path";

// Load .env from the monorepo root (two levels up from apps/backend/)
dotenv.config({
  path: path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    process.env.NODE_ENV === "test" ? ".env.test" : ".env"
  ),
});

// Sentry must init after env vars are loaded (needs SENTRY_DSN)
import "./sentry";
