import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";
import { ExtendedSession } from "@workspace/lib/auth/auth-client";

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL; // https://dashboard.fotno.com

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicPaths = new Set([
    "/account",
    "/onboarding",
    "/reset-password",
    "/add-account",
  ]);

  // Redirect root to login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  // Check session
  let session: ExtendedSession | null = null;

  try {
    const response = await betterFetch<ExtendedSession>("/api/auth/get-session", {
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    });

    session = response.data ?? null;
  } catch {
    session = null;
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  // (except /add-account — multi-session: sign in while already signed in)
  if (session?.user && publicPaths.has(pathname) && pathname !== "/add-account" && pathname !== "/onboarding") {
    return NextResponse.redirect(
      DASHBOARD_URL || "https://dashboard.fotno.com"
    );
  }

  // Allow access to public paths even without authentication
  if (publicPaths.has(pathname)) {
    return NextResponse.next();
  }

  // Block access to all other routes if not authenticated
  if (!session?.user) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  // Allow access to protected routes for authenticated users
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next).*)"],
};
