import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const period = request.nextUrl.searchParams.get("period") ?? "30d";
  const response = await backendJsonFetch(
    `/api/dashboard/galleries/${id}/analytics?period=${period}`,
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
