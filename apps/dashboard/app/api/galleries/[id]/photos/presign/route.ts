import { NextRequest, NextResponse } from "next/server";
import { createId, getStore } from "@/lib/mocks/data-store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const store = getStore();
  const body = await request.json();

  const gallery = store.galleries.find((item) => item.id === id);
  if (!gallery) {
    return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
  }

  const uploadId = createId("upload");

  store.uploadTickets.push({
    uploadId,
    galleryId: id,
    fileName: body.fileName,
    fileType: body.fileType,
    size: Number(body.size) || 0,
    uploaded: false,
  });

  return NextResponse.json({
    uploadId,
    uploadUrl: `/api/uploads/${uploadId}`,
    confirmUrl: `/api/galleries/${id}/photos/confirm`,
    method: "PUT",
  });
}
