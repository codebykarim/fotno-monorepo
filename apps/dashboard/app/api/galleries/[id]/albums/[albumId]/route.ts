import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; albumId: string }> }
) {
  const { id, albumId } = await params;
  const body = await request.json();
  const response = await backendJsonFetch(
    `/api/dashboard/galleries/${id}/albums/${albumId}`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    },
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; albumId: string }> }
) {
  const { id, albumId } = await params;
  const response = await backendJsonFetch(
    `/api/dashboard/galleries/${id}/albums/${albumId}`,
    {
      method: "DELETE",
    },
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
