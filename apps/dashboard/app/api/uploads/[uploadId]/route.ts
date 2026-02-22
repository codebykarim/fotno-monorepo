import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/mocks/data-store";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ uploadId: string }> }
) {
  const { uploadId } = await params;
  const store = getStore();
  const ticket = store.uploadTickets.find((item) => item.uploadId === uploadId);

  if (!ticket) {
    return NextResponse.json({ error: "Upload ticket not found" }, { status: 404 });
  }

  await request.arrayBuffer();
  ticket.uploaded = true;

  return NextResponse.json({ success: true });
}
