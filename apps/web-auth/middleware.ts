import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth";

// const DASHBOARD_URL = "https://www.fotno.com"; // https://dashboard.fotno.com

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);
  // const authRoutes = ["/login", "/register", "/reset-password"];

  // // Allow access to auth routes when not authenticated
  // if (authRoutes.includes(pathname)) {
  //   // If user is authenticated, redirect to dashboard
  //   if (sessionCookie) {
  //     return NextResponse.redirect(DASHBOARD_URL);
  //   }
  //   return NextResponse.next();
  // }

  // Redirect root to login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Block access to all other routes if not authenticated
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow access to protected routes for authenticated users
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
