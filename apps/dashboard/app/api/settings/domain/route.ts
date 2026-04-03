import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function GET(request: NextRequest) {
  const response = await backendJsonFetch("/api/settings/domain");
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const response = await backendJsonFetch("/api/settings/domain", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}

export async function DELETE(request: NextRequest) {
  const response = await backendJsonFetch("/api/settings/domain", {
    method: "DELETE",
  });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
