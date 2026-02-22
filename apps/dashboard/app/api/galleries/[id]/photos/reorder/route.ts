import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const response = await backendJsonFetch(
    `/api/dashboard/galleries/${id}/photos/reorder`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    },
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
