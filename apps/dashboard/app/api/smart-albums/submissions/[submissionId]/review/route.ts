import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  const { submissionId } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const response = await backendJsonFetch(
    `/api/dashboard/smart-album/submissions/${submissionId}/review`,
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
