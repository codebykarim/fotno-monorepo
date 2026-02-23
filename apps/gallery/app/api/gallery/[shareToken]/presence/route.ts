import { NextRequest, NextResponse } from "next/server";
import {
  getActiveViewers,
  removeViewer,
  upsertViewer,
  ViewerRole,
} from "@/lib/gallery-runtime-store";

export const runtime = "nodejs";

const parseRole = (value: string | null): ViewerRole =>
  value === "photographer" ? "photographer" : "client";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ shareToken: string }> },
) {
  const { shareToken } = await context.params;
  const viewers = getActiveViewers(shareToken);

  return NextResponse.json({
    count: viewers.filter((viewer) => viewer.role === "client").length,
    viewers,
  });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ shareToken: string }> },
) {
  const { shareToken } = await context.params;
  const body = (await request.json().catch(() => null)) as
    | { viewerId?: string; name?: string; role?: string }
    | null;

  if (!body?.viewerId) {
    return NextResponse.json({ error: "viewerId is required" }, { status: 400 });
  }

  const viewers = upsertViewer({
    shareToken,
    viewerId: body.viewerId,
    name: body.name?.trim() || "Guest",
    role: parseRole(body.role ?? null),
  });

  return NextResponse.json({
    count: viewers.filter((viewer) => viewer.role === "client").length,
    viewers,
  });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ shareToken: string }> },
) {
  const { shareToken } = await context.params;
  const body = (await request.json().catch(() => null)) as
    | { viewerId?: string }
    | null;

  if (!body?.viewerId) {
    return NextResponse.json({ error: "viewerId is required" }, { status: 400 });
  }

  const viewers = removeViewer(shareToken, body.viewerId);

  return NextResponse.json({
    count: viewers.filter((viewer) => viewer.role === "client").length,
    viewers,
  });
}
