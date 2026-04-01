import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function GET() {
  const response = await backendJsonFetch("/api/dashboard/smart-album/config");
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const response = await backendJsonFetch("/api/dashboard/smart-album/config", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
