import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";

const DASHBOARD_URL = "https://www.fotno.com"; // https://dashboard.fotno.com

type Session = {
  user?: {
    id: string;
    // ... other user fields
  };
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicPaths = ["/login", "/register"];

  // Redirect root to login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check session
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  console.log(session);

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (session?.user && publicPaths.includes(pathname)) {
    return NextResponse.redirect(DASHBOARD_URL);
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
