"use client";

import { useEffect } from "react";

export function DatadogInit() {
  useEffect(() => {
    const clientToken = process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN;
    const applicationId = process.env.NEXT_PUBLIC_DD_APPLICATION_ID;

    // Skip if Datadog env vars are not set
    if (!clientToken || !applicationId) return;

    async function initDatadog() {
      const { datadogRum } = await import("@datadog/browser-rum");
      const { datadogLogs } = await import("@datadog/browser-logs");

      datadogRum.init({
        applicationId,
        clientToken: clientToken!,
        site: process.env.NEXT_PUBLIC_DD_SITE || "datadoghq.com",
        service: "fotno-dashboard",
        env: process.env.NEXT_PUBLIC_DD_ENV || process.env.NODE_ENV || "development",
        version: process.env.NEXT_PUBLIC_DD_VERSION || "1.0.0",
        sessionSampleRate: 100,
        sessionReplaySampleRate: 20,
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: "mask-user-input",
        allowedTracingUrls: [
          { match: process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.fotno.com", propagatorTypes: ["tracecontext"] },
        ],
      });

      datadogLogs.init({
        clientToken: clientToken!,
        site: process.env.NEXT_PUBLIC_DD_SITE || "datadoghq.com",
        service: "fotno-dashboard",
        env: process.env.NEXT_PUBLIC_DD_ENV || process.env.NODE_ENV || "development",
        forwardErrorsToLogs: true,
        sessionSampleRate: 100,
      });
    }

    initDatadog();
  }, []);

  return null;
}
