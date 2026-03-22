import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";
import { ExtendedSession } from "@workspace/lib/auth/auth-client";

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Check session using better-fetch
    const { data: session } = await betterFetch<ExtendedSession>(
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

    if ((session?.user as any)?.role === "admin") {
      return NextResponse.redirect(
        process.env.NEXT_PUBLIC_ADMIN_URL || "https://admin.fotno.com"
      );
    }

    // Allow access to payment-callback route without subscription check
    if (pathname === "/payment-callback") {
      return NextResponse.next();
    }

    // Detect visitor country for regional pricing
    const response = NextResponse.next();
    const country =
      request.headers.get("cf-ipcountry") ||
      request.headers.get("x-vercel-ip-country") ||
      null;

    if (country && !request.cookies.get("user_country")) {
      response.cookies.set("user_country", country, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
        sameSite: "lax",
      });
    }

    return response;
  } catch (error) {
    // In case of any unexpected errors, redirect to auth
    console.error("Middleware error:", error);
    return NextResponse.redirect(
      process.env.NEXT_PUBLIC_AUTH_URL || "https://auth.fotno.com"
    );
  }
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next).*)"],
};
