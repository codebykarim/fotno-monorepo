import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth";

const DASHBOARD_URL = "https://dashboard.fotno.com"; // https://dashboard.fotno.com

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);
  const authRoutes = ["/login", "/register", "/reset-password"];

  // If user is authenticated, redirect to dashboard
  if (sessionCookie) {
    const response = NextResponse.redirect(DASHBOARD_URL);
    response.cookies.set("better-auth.session_token", sessionCookie);
    return response;
  }

  // Redirect root to login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow access to auth routes when not authenticated
  if (authRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Block access to all other routes
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
