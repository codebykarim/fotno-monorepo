import { NextResponse, type NextRequest } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const response = await backendJsonFetch(
    `/api/dashboard/gphotos/session/${sessionId}`,
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
