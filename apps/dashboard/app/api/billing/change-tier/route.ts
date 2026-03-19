import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const response = await backendJsonFetch("/api/billing/change-tier", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
