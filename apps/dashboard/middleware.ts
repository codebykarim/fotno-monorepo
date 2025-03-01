import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL; // https://dashboard.fotno.com

type Session = {
  user?: {
    id: string;
    plan?: string;
    // ... other user fields
  };
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  // If no user is authenticated, redirect to auth app
  if (!session?.user) {
    return NextResponse.redirect(
      process.env.NEXT_PUBLIC_AUTH_URL || "https://auth.fotno.com"
    );
  }

  // If user has no plan and not on onboarding, redirect to onboarding
  if (!session.user.plan && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // Allow access to protected routes for authenticated users
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next).*)"],
};
