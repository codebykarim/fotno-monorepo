import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get("limit") ?? "50";
  const offset = searchParams.get("offset") ?? "0";
  const response = await backendJsonFetch(
    `/api/dashboard/galleries/${id}/photos?limit=${limit}&offset=${offset}`,
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
