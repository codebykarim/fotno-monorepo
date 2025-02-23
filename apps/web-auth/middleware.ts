import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth";

const DASHBOARD_URL = "https://www.fotno.com"; // https://dashboard.fotno.com

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  // Define public paths that don't require authentication
  const publicPaths = ["/login", "/register"];

  // Redirect root to login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (sessionCookie && publicPaths.includes(pathname)) {
    return NextResponse.redirect(DASHBOARD_URL);
  }

  // Allow access to public paths even without authentication
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Block access to all other routes if not authenticated
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow access to protected routes for authenticated users
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next).*)"],
};
