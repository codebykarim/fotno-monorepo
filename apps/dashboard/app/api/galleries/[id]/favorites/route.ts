import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const response = await backendJsonFetch(
    `/api/dashboard/galleries/${id}/favorites`,
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
