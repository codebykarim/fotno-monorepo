import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  const { submissionId } = await params;
  const force = request.nextUrl.searchParams.get("force") === "true";
  const url = `/api/dashboard/smart-album/submissions/${submissionId}/export${force ? "?force=true" : ""}`;
  const response = await backendJsonFetch(url, { method: "POST" });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
