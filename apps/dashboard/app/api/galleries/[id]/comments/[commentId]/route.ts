import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  const { id, commentId } = await params;
  const body = await request.json();
  const response = await backendJsonFetch(
    `/api/dashboard/galleries/${id}/comments/${commentId}`,
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
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  const { id, commentId } = await params;
  const response = await backendJsonFetch(
    `/api/dashboard/galleries/${id}/comments/${commentId}`,
    {
      method: "DELETE",
    },
  );
  const text = await response.text();
  let payload = {};
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      // not JSON
    }
  }
  return NextResponse.json(payload, { status: response.status });
}
