import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const response = await backendJsonFetch(
    `/api/dashboard/galleries/${id}/photos/presign`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );
  const payload = await response.json();
  if (!response.ok) {
    return NextResponse.json(payload, { status: response.status });
  }

  return NextResponse.json({
    uploadId: payload.uploadId,
    uploadUrl: payload.uploadUrl,
    confirmUrl: `/api/galleries/${id}/photos/confirm`,
    method: "PUT",
  });
}
