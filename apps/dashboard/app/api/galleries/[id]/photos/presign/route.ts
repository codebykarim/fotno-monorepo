import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const response = await backendJsonFetch(
    `/api/dashboard/galleries/${id}/photos/presign`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );
  const payload = await response.json();
  if (!response.ok) {
    return NextResponse.json(payload, { status: response.status });
  }

  const presignedParts = Array.isArray(payload.presignedParts)
    ? payload.presignedParts
    : [];
  const photoId = String(payload.photoId ?? payload.uploadId ?? "");

  return NextResponse.json({
    photoId,
    uploadId: photoId,
    totalParts: Number(payload.totalParts ?? presignedParts.length ?? 1),
    chunkSizeBytes: 10 * 1024 * 1024,
    presignedParts,
    duplicate: Boolean(payload.duplicate),
    storageWarning: payload.storageWarning,
    partCompleteUrl: `/api/galleries/${id}/photos/part-complete`,
    confirmUrl: `/api/galleries/${id}/photos/confirm`,
  });
}
