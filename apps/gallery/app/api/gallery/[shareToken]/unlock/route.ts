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
