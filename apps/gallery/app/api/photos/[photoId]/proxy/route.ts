import { getPhotoPresignedUrl } from "@/lib/gallery-service";
import type { PhotoVariant } from "@/lib/gallery-types";
import { IMAGE_POLICY, PROTECTED_IMAGE_HEADERS } from "@/lib/image-policy";
import { NextRequest, NextResponse } from "next/server";

const VALID_VARIANTS: PhotoVariant[] = ["thumbnail", "preview", "original"];
export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ photoId: string }> }
) {
  try {
    const { photoId } = await context.params;
    const shareToken = request.nextUrl.searchParams.get("shareToken");
    const variant =
      (request.nextUrl.searchParams.get("variant") as PhotoVariant | null) ??
      "preview";
    const token = request.nextUrl.searchParams.get("token") || undefined;

    if (!shareToken) {
      return NextResponse.json(
        { error: "shareToken is required" },
        { status: 400 }
      );
    }

    if (!VALID_VARIANTS.includes(variant)) {
      return NextResponse.json({ error: "Invalid variant" }, { status: 400 });
    }

    if (!IMAGE_POLICY.ALLOW_PROXY_VARIANTS.has(variant)) {
      return NextResponse.json(
        { error: "Direct access to original files is blocked. Use download action." },
        { status: 403 }
      );
    }

    const fetchDest = request.headers.get("sec-fetch-dest");
    if (fetchDest && fetchDest !== "image") {
      return NextResponse.json(
        { error: "Blocked by image protection policy" },
        { status: 403 }
      );
    }

    const url = await getPhotoPresignedUrl(photoId, shareToken, variant, token);
    const upstream = await fetch(url, { cache: "no-store" });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: "Unable to stream image preview" }, { status: 502 });
    }

    const contentLengthHeader = upstream.headers.get("content-length");
    const contentLength = contentLengthHeader ? Number(contentLengthHeader) : null;
    if (
      variant === "preview" &&
      Number.isFinite(contentLength) &&
      contentLength !== null &&
      contentLength > IMAGE_POLICY.PREVIEW_MAX_BYTES
    ) {
      return NextResponse.json(
        { error: "Preview exceeds policy size budget. Re-process image required." },
        { status: 422 }
      );
    }

    const contentType = upstream.headers.get("content-type") ?? "image/webp";
    const headers = new Headers(PROTECTED_IMAGE_HEADERS);
    headers.set("Content-Type", contentType);
    if (contentLengthHeader) {
      headers.set("Content-Length", contentLengthHeader);
    }
    headers.set("Content-Disposition", "inline; filename=\"preview.webp\"");

    return new NextResponse(upstream.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to proxy image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
