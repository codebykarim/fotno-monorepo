import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";

type AdminSession = {
  user: {
    id: string;
    email: string;
    name?: string | null;
    role?: string | null;
  };
};

export async function middleware(request: NextRequest) {
  // Skip auth check for login page
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  try {
    // Use the admin app's own auth proxy (same domain/port = same cookies)
    const adminBaseUrl = request.nextUrl.origin; // e.g. http://localhost:3004

    const { data: session } = await betterFetch<AdminSession>(
      "/api/auth/get-session",
      {
        baseURL: adminBaseUrl,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next).*)"],
};
