import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth";

// Define public routes that don't require authentication
const publicRoutes = ["/login", "/register", "/forgot-password"];

// Define protected routes that require authentication
const protectedRoutes = ["/dashboard", "/dashboard/:path*", "/settings"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);
  const isAuthRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.some((route) => {
    if (route.includes(":path*")) {
      const basePath = route.split("/:path*")[0];
      return pathname.startsWith(basePath ?? "");
    }
    return route === pathname;
  });

  // Case 1: User is not authenticated and tries to access protected route
  if (!sessionCookie && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Case 2: User is authenticated and tries to access auth routes (login, register)
  if (sessionCookie && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Case 3: Allow access to public routes when not authenticated
  if (!sessionCookie && isAuthRoute) {
    return NextResponse.next();
  }

  // Case 4: Allow access to protected routes when authenticated
  if (sessionCookie && isProtectedRoute) {
    return NextResponse.next();
  }

  // Default: Allow access to any other route
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all protected routes
    "/dashboard/:path*",
    "/settings",
    // Match all public routes
    "/login",
    "/register",
    "/forgot-password",
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
