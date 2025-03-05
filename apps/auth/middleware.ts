import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";
import { ExtendedSession } from "@workspace/lib/auth/auth-client";

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL; // https://dashboard.fotno.com

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicPaths = ["/login", "/register", "/onboarding", "/reset-password"];

  // Redirect root to login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check session
  const { data: session } = await betterFetch<ExtendedSession>(
    "/api/auth/get-session",
    {
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (session?.user && publicPaths.includes(pathname)) {
    return NextResponse.redirect(
      DASHBOARD_URL || "https://dashboard.fotno.com"
    );
  }

  // Allow access to public paths even without authentication
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Block access to all other routes if not authenticated
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow access to protected routes for authenticated users
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next).*)"],
};
