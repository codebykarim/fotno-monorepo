import jwt from "jsonwebtoken";

/**
 * Client for calling the upload-service HTTP API from the backend.
 * All upload orchestration (presign, part-complete, confirm, session) is delegated to the upload-service.
 * Uses short-lived JWTs for auth; UPLOAD_SERVICE_URL must point to the running upload-service.
 */

type UploadServiceError = {
  error?: string;
  message?: string;
};

export type UploadServiceResult<T> =
  | {
      ok: true;
      status: number;
      data: T;
    }
  | {
      ok: false;
      status: number;
      error: string;
      data?: unknown;
    };

/** Resolves the upload-service base URL from env. Defaults to localhost:4001 for development. */
const resolveUploadServiceBaseUrl = (): string => {
  const url = process.env.UPLOAD_SERVICE_URL ?? "http://localhost:4001";
  return url.replace(/\/$/, "");
};

/** Builds a short-lived JWT for the upload-service to authenticate the backend's request. */
const buildUploadServiceToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is required to call upload-service");
  }

  return jwt.sign(
    {
      sub: userId,
      role: "photographer",
      email: "",
      plan: "TRIAL",
    },
    secret,
    { expiresIn: "15m" },
  );
};

/** Parses the response body as JSON, or returns text/null on failure. */
const parseJson = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

/**
 * Sends an HTTP request to the upload-service with the user's JWT. Used by all dashboard upload
 * services (presign, part-complete, confirm, get sessions). Returns typed result or error.
 */
export const uploadServiceRequest = async <T>(
  userId: string,
  path: string,
  init: RequestInit = {},
): Promise<UploadServiceResult<T>> => {
  const token = buildUploadServiceToken(userId);
  const url = `${resolveUploadServiceBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init.headers);

  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    const parsedError =
      payload && typeof payload === "object" ? (payload as UploadServiceError) : null;

    return {
      ok: false,
      status: response.status,
      error:
        parsedError?.message ??
        parsedError?.error ??
        `Upload-service request failed (${response.status})`,
      data: payload,
    };
  }

  return {
    ok: true,
    status: response.status,
    data: payload as T,
  };
};

