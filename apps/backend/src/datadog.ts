/**
 * Datadog APM tracer initialization.
 * MUST be imported before any other module to enable auto-instrumentation
 * of Express, pg, ioredis, http, etc.
 */
import tracer from "dd-trace";

tracer.init({
  service: "fotno-api",
  env: process.env.DD_ENV || process.env.NODE_ENV || "development",
  version: process.env.DD_VERSION || "1.0.0",
  logInjection: true,
  runtimeMetrics: true,
  profiling: true,
  tags: {
    team: "fotno",
  },
});

export default tracer;
