import { NextRequest, NextResponse } from "next/server";
import { backendJsonFetch } from "@/lib/backend";

const resolveGalleryBaseUrl = (): string => {
  const baseUrl =
    process.env.NEXT_PUBLIC_GALLERY_URL ?? "http://localhost:3003";
  return baseUrl.replace(/\/$/, "");
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const detailResponse = await backendJsonFetch(`/api/dashboard/galleries/${id}`);

  if (!detailResponse.ok) {
    const payload = await detailResponse.json().catch(() => ({}));
    return NextResponse.json(payload, { status: detailResponse.status });
  }

  const detailPayload = (await detailResponse.json()) as {
    gallery?: { slug?: string };
  };
  const slug = detailPayload.gallery?.slug;
  if (!slug) {
    return NextResponse.json({ error: "Gallery slug missing" }, { status: 400 });
  }

  const presenceResponse = await fetch(
    `${resolveGalleryBaseUrl()}/api/gallery/${encodeURIComponent(slug)}/presence`,
    { cache: "no-store" },
  );

  const presencePayload = await presenceResponse.json().catch(() => ({}));
  return NextResponse.json(presencePayload, { status: presenceResponse.status });
}
