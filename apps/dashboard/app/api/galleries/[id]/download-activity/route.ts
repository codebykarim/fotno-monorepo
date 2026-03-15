import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const limit = request.nextUrl.searchParams.get("limit") ?? "50";
  const offset = request.nextUrl.searchParams.get("offset") ?? "0";
  const response = await backendJsonFetch(
    `/api/dashboard/galleries/${id}/download-activity?limit=${limit}&offset=${offset}`,
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
