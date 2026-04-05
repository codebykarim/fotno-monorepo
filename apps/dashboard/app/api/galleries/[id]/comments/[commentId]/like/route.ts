import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  const { id, commentId } = await params;
  const response = await backendJsonFetch(
    `/api/dashboard/galleries/${id}/comments/${commentId}/like`,
    { method: "POST" },
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
