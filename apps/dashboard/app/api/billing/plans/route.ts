import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function GET(request: NextRequest) {
  const country =
    request.cookies.get("user_country")?.value ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-vercel-ip-country") ||
    "";
  const url = country
    ? `/api/billing/plans?country=${encodeURIComponent(country)}`
    : "/api/billing/plans";
  const response = await backendJsonFetch(url);
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
