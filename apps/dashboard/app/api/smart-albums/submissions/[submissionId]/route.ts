import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  const { submissionId } = await params;
  const response = await backendJsonFetch(
    `/api/dashboard/smart-album/submissions/${submissionId}`
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
