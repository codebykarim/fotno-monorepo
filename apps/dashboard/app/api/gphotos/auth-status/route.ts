import { NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function GET() {
  const response = await backendJsonFetch(
    "/api/dashboard/gphotos/auth-status",
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
