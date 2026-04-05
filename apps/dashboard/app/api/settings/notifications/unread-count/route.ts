import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function GET(_request: NextRequest) {
  const response = await backendJsonFetch(
    "/api/settings/notifications/unread-count",
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
