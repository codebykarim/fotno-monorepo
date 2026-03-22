import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN_GALLERY,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV || "development",

  // Performance monitoring — 30% of transactions in production
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.3 : 1.0,

  // Session Replay — capture 10% of sessions, 100% on error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  integrations: [Sentry.replayIntegration()],

  // Filter out expected 4xx client errors
  beforeSend(event) {
    const statusCode = event.contexts?.response?.status_code;
    if (typeof statusCode === "number" && statusCode >= 400 && statusCode < 500) {
      return null;
    }
    return event;
  },
});
