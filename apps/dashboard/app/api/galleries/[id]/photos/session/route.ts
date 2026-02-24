import { NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const response = await backendJsonFetch(
    `/api/dashboard/galleries/${id}/photos/session`,
    {
      method: "GET",
    },
  );

  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
