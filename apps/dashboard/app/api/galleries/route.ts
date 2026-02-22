import { NextRequest, NextResponse } from "next/server";
import { createId, getStore } from "@/lib/mocks/data-store";
import { listGalleries } from "@/lib/api/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? undefined;
  const statusParam = request.nextUrl.searchParams.get("status") ?? "all";
  const sortParam = request.nextUrl.searchParams.get("sort") ?? "newest";

  const galleries = listGalleries({
    query,
    status: statusParam as "all" | "draft" | "published",
    sort: sortParam as "newest" | "oldest" | "title_asc" | "title_desc",
  });

  return NextResponse.json({ galleries });
}

export async function POST(request: NextRequest) {
  const store = getStore();
  const body = await request.json();

  const title = (body?.title as string | undefined)?.trim();
  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const slugBase =
    (body?.slug as string | undefined)?.trim() ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const gallery = {
    id: createId("gallery"),
    title,
    slug: `${slugBase}-${Math.floor(Math.random() * 1000)}`,
    passwordEnabled: false,
    password: null,
    isPublished: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    coverPhotoId: null,
  };

  store.galleries.push(gallery);
  store.activity.unshift({
    id: createId("act"),
    message: `Created gallery ${gallery.title}`,
    at: new Date().toISOString(),
  });

  return NextResponse.json({ gallery }, { status: 201 });
}
