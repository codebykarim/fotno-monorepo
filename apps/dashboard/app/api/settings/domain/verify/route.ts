import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function POST(request: NextRequest) {
  const response = await backendJsonFetch("/api/settings/domain/verify", {
    method: "POST",
  });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
