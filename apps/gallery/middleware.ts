import { betterFetch } from "@better-fetch/fetch";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ExtendedSession } from "@workspace/lib/auth/auth-client";

const protectedPrefixes = ["/collections", "/starred", "/mypage", "/settings"];

const shouldProtectPath = (pathname: string): boolean =>
  protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!shouldProtectPath(pathname)) {
    return NextResponse.next();
  }

  try {
    const { data: session } = await betterFetch<ExtendedSession>(
      "/api/auth/get-session",
      {
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!session?.user) {
      return NextResponse.redirect(
        process.env.NEXT_PUBLIC_AUTH_URL || "https://auth.fotno.com"
      );
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(
      process.env.NEXT_PUBLIC_AUTH_URL || "https://auth.fotno.com"
    );
  }
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next).*)"],
};
