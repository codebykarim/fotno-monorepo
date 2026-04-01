import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ shareToken: string; designId: string }> },
) {
  const { shareToken, designId } = await context.params;
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const response = await backendFetch(
    `/api/public/gallery/${encodeURIComponent(shareToken)}/smart-album/designs/${encodeURIComponent(designId)}/confirm-payment`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );

  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
