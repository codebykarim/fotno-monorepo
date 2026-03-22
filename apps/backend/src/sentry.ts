import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN_BACKEND,
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || "development",
  release: process.env.SENTRY_RELEASE || "fotno-api@1.0.0",
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.3 : 1.0,
  profilesSampleRate: 0.1,
  integrations: [
    Sentry.expressIntegration(),
    Sentry.httpIntegration(),
    Sentry.prismaIntegration(),
  ],
  // Don't send expected 4xx errors as issues
  beforeSend(event) {
    const statusCode = event.contexts?.response?.status_code;
    if (typeof statusCode === "number" && statusCode >= 400 && statusCode < 500) {
      return null;
    }
    return event;
  },
});

export default Sentry;
