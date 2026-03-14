import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const response = await backendJsonFetch("/api/dashboard/gphotos/import", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
  });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
