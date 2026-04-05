import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> },
) {
  const { notificationId } = await params;
  const response = await backendJsonFetch(
    `/api/settings/notifications/${notificationId}/read`,
    { method: "POST" },
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
