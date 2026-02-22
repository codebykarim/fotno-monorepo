const DEFAULT_HEADERS = {
  Accept: "application/json",
};

type NextFetchConfig = {
  revalidate?: number;
  tags?: string[];
};

type BackendRequestInit = RequestInit & {
  next?: NextFetchConfig;
};

const resolveBackendUrl = (): string => {
  const url = process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error("BACKEND_API_URL or NEXT_PUBLIC_API_URL is required");
  }

  return url.replace(/\/$/, "");
};

export const buildBackendUrl = (path: string): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${resolveBackendUrl()}${normalizedPath}`;
};

export const backendFetch = async (
  path: string,
  init: BackendRequestInit = {}
): Promise<Response> => {
  const headers = new Headers(init.headers);

  for (const [key, value] of Object.entries(DEFAULT_HEADERS)) {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  }

  return fetch(buildBackendUrl(path), {
    ...init,
    headers,
    cache: init.cache ?? "no-store",
  });
};
