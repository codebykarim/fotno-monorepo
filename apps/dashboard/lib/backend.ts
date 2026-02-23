import { headers as nextHeaders } from "next/headers";

const resolveBackendBaseUrl = (): string => {
  const baseUrl = process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("BACKEND_API_URL or NEXT_PUBLIC_API_URL is required");
  }

  return baseUrl.replace(/\/$/, "");
};

export const buildBackendUrl = (path: string): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${resolveBackendBaseUrl()}${normalizedPath}`;
};

export const backendJsonFetch = async (
  path: string,
  init: RequestInit = {},
) => {
  const headers = new Headers(init.headers);
  const incomingHeaders = await nextHeaders();

  if (!headers.has("cookie")) {
    const cookie = incomingHeaders.get("cookie");
    if (cookie) {
      headers.set("cookie", cookie);
    }
  }

  if (!headers.has("authorization")) {
    const authorization = incomingHeaders.get("authorization");
    if (authorization) {
      headers.set("authorization", authorization);
    }
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(buildBackendUrl(path), {
    ...init,
    headers,
    cache: "no-store",
  });
};
