import { NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ folderId: string }> },
) {
  const { folderId } = await params;
  const response = await backendJsonFetch(
    `/api/dashboard/gdrive/folders/${folderId}/preview`,
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
