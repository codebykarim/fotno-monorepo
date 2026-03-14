import { NextResponse, type NextRequest } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url") ?? "";
  const response = await backendJsonFetch(
    `/api/dashboard/gphotos/image?url=${encodeURIComponent(url)}`,
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to load image" },
      { status: response.status },
    );
  }

  const buffer = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") ?? "image/jpeg";

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
