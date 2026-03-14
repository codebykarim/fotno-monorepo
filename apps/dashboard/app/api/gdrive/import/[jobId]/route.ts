import { NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;
  const response = await backendJsonFetch(
    `/api/dashboard/gdrive/import/${jobId}`,
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
