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
      // body already contains storageTierGb and (optionally) interval from the client;
      // we only inject countryCode here.
      ...(country ? { countryCode: country } : {}),
    }),
  });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
