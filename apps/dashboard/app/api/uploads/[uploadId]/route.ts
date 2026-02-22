import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  _request: NextRequest,
  _context: { params: Promise<{ uploadId: string }> }
) {
  return NextResponse.json(
    { error: "Deprecated endpoint. Upload directly to presigned URL." },
    { status: 410 },
  );
}
