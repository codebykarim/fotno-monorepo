import { NextRequest, NextResponse } from "next/server";
import { createId, getStore } from "@/lib/mocks/data-store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const store = getStore();
  const body = await request.json();

  const items = body?.items as Array<{ photoId: string; order: number }>;
  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "items array is required" }, { status: 400 });
  }

  const photoIds = new Set(store.photos.filter((photo) => photo.galleryId === id).map((photo) => photo.id));

  items.forEach((item) => {
    if (!photoIds.has(item.photoId)) {
      return;
    }

    const index = store.photos.findIndex((photo) => photo.id === item.photoId);
    if (index >= 0) {
      const current = store.photos[index];
      if (!current) {
        return;
      }
      store.photos[index] = {
        ...current,
        order: item.order,
      };
    }
  });

  store.activity.unshift({
    id: createId("act"),
    message: "Reordered gallery photos",
    at: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
