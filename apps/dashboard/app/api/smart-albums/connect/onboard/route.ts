import { NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function POST() {
  const response = await backendJsonFetch("/api/dashboard/smart-album/connect/onboard", {
    method: "POST",
  });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
