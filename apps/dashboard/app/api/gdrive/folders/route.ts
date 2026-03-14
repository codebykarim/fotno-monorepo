import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.toString();
  const response = await backendJsonFetch(
    `/api/dashboard/gdrive/folders?${query}`,
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
