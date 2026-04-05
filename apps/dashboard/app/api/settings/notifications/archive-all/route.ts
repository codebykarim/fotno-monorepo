import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function POST(_request: NextRequest) {
  const response = await backendJsonFetch(
    "/api/settings/notifications/archive-all",
    { method: "POST" },
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
