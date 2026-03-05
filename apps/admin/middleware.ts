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
  try {
    const { data: session } = await betterFetch<AdminSession>(
      "/api/auth/get-session",
      {
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!session?.user) {
      return NextResponse.redirect(
        process.env.NEXT_PUBLIC_AUTH_URL || "https://auth.fotno.com"
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.redirect(
        process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3001"
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return NextResponse.redirect(
      process.env.NEXT_PUBLIC_AUTH_URL || "https://auth.fotno.com"
    );
  }
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next).*)"],
};
