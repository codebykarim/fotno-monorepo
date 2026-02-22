import { backendFetch } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type AttemptEntry = {
  attempts: number;
  resetAt: number;
};

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const unlockAttemptStore = new Map<string, AttemptEntry>();

const getClientIp = (request: NextRequest): string => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
};

const consumeAttempt = (ip: string): { blocked: boolean; remainingMs: number } => {
  const now = Date.now();
  const existing = unlockAttemptStore.get(ip);

  if (!existing || existing.resetAt <= now) {
    unlockAttemptStore.set(ip, {
      attempts: 1,
      resetAt: now + WINDOW_MS,
    });

    return { blocked: false, remainingMs: WINDOW_MS };
  }

  if (existing.attempts >= MAX_ATTEMPTS) {
    return { blocked: true, remainingMs: existing.resetAt - now };
  }

  unlockAttemptStore.set(ip, {
    attempts: existing.attempts + 1,
    resetAt: existing.resetAt,
  });

  return { blocked: false, remainingMs: existing.resetAt - now };
};

const clearAttempts = (ip: string) => {
  unlockAttemptStore.delete(ip);
};

type DashboardListResponse = {
  galleries?: Array<{
    id: string;
    slug: string;
  }>;
};

type DashboardGalleryResponse = {
  gallery?: {
    id: string;
    slug: string;
    isPublished?: boolean;
    passwordEnabled?: boolean;
    password?: string | null;
  };
};

const getDashboardBaseUrl = (): string => {
  const dashboardUrl =
    process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:3001";
  return dashboardUrl.replace(/\/$/, "");
};

const encodeBase64Url = (value: string): string =>
  Buffer.from(value).toString("base64url");

const createLocalUnlockToken = (shareToken: string): string => {
  const header = encodeBase64Url(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = encodeBase64Url(
    JSON.stringify({
      sub: shareToken,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      source: "gallery-local-fallback",
    }),
  );
  return `${header}.${payload}.local`;
};

const unlockAgainstDashboardMock = async (
  shareToken: string,
  password: string,
): Promise<{ token: string; expiresAt: string } | null> => {
  const dashboardBaseUrl = getDashboardBaseUrl();
  const listResponse = await fetch(
    `${dashboardBaseUrl}/api/galleries?q=${encodeURIComponent(shareToken)}&status=all&sort=newest`,
    { cache: "no-store" },
  );

  if (!listResponse.ok) {
    return null;
  }

  const listPayload = (await listResponse.json()) as DashboardListResponse;
  const galleryListItem = listPayload.galleries?.find(
    (gallery) => gallery.slug === shareToken,
  );
  if (!galleryListItem) {
    return null;
  }

  const detailResponse = await fetch(
    `${dashboardBaseUrl}/api/galleries/${galleryListItem.id}`,
    { cache: "no-store" },
  );
  if (!detailResponse.ok) {
    return null;
  }

  const detailPayload = (await detailResponse.json()) as DashboardGalleryResponse;
  const gallery = detailPayload.gallery;
  if (!gallery) {
    return null;
  }

  if (!gallery.isPublished) {
    return null;
  }

  if (!gallery.passwordEnabled) {
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    return {
      token: createLocalUnlockToken(shareToken),
      expiresAt,
    };
  }

  if (!gallery.password || gallery.password !== password) {
    throw new Error("Invalid password");
  }

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  return {
    token: createLocalUnlockToken(shareToken),
    expiresAt,
  };
};

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ shareToken: string }> }
) {
  const ip = getClientIp(request);
  const rateLimitState = consumeAttempt(ip);

  if (rateLimitState.blocked) {
    return NextResponse.json(
      {
        error: "Too many unlock attempts. Try again in a few minutes.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rateLimitState.remainingMs / 1000).toString(),
        },
      }
    );
  }

  const payload = (await request.json().catch(() => null)) as
    | {
        password?: string;
      }
    | null;

  if (!payload?.password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  try {
    const { shareToken } = await context.params;

    const response = await backendFetch(`/api/public/gallery/${shareToken}/unlock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: payload.password }),
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.text();
      const backendRouteMissing =
        response.status === 404 ||
        body.includes("Cannot POST /api/public/gallery/");

      if (backendRouteMissing) {
        try {
          const fallbackResult = await unlockAgainstDashboardMock(
            shareToken,
            payload.password,
          );

          if (fallbackResult) {
            clearAttempts(ip);
            return NextResponse.json({
              token: fallbackResult.token,
              expiresAt: fallbackResult.expiresAt,
            });
          }
        } catch (fallbackError) {
          const fallbackMessage =
            fallbackError instanceof Error
              ? fallbackError.message
              : "Invalid password";
          return NextResponse.json({ error: fallbackMessage }, { status: 401 });
        }
      }

      return NextResponse.json(
        {
          error: body || "Invalid password",
        },
        { status: response.status }
      );
    }

    clearAttempts(ip);

    const data = (await response.json()) as {
      token?: string;
      jwt?: string;
      expiresAt?: string;
    };

    return NextResponse.json({
      token: data.token ?? data.jwt,
      expiresAt: data.expiresAt ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unlock failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
