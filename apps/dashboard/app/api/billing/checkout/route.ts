import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const country =
    request.cookies.get("user_country")?.value ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-vercel-ip-country") ||
    "";
  const response = await backendJsonFetch("/api/billing/checkout", {
    method: "POST",
    body: JSON.stringify({
      ...body,
      ...(country ? { countryCode: country } : {}),
    }),
  });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
