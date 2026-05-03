import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN_GALLERY,
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || "development",

  // Performance monitoring — 30% of transactions in production
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.3 : 1.0,

  // Next.js raises ResponseAborted when a client disconnects mid-stream
  // (e.g. mobile Safari closing the tab during /download-all). Not an app error.
  ignoreErrors: ["ResponseAborted"],
});
