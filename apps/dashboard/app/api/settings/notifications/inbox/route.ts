import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function GET(request: NextRequest) {
  const archived = request.nextUrl.searchParams.get("archived") === "true";
  const response = await backendJsonFetch(
    `/api/settings/notifications/inbox${archived ? "?archived=true" : ""}`,
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
