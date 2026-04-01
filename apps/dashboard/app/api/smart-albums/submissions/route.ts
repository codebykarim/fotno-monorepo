import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = new URLSearchParams();
  if (searchParams.get("status")) params.set("status", searchParams.get("status")!);
  if (searchParams.get("galleryId")) params.set("galleryId", searchParams.get("galleryId")!);
  if (searchParams.get("page")) params.set("page", searchParams.get("page")!);
  if (searchParams.get("pageSize")) params.set("pageSize", searchParams.get("pageSize")!);

  const qs = params.toString();
  const response = await backendJsonFetch(
    `/api/dashboard/smart-album/submissions${qs ? `?${qs}` : ""}`
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
