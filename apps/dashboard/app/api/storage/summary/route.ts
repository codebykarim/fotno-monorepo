import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const response = await backendJsonFetch("/api/storage/summary", {
    headers: authorization ? { Authorization: authorization } : undefined,
  });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
