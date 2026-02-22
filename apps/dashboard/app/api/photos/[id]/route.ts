import { NextRequest, NextResponse } from "next/server";
import { createId, getStore } from "@/lib/mocks/data-store";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const store = getStore();
  const target = store.photos.find((photo) => photo.id === id);

  if (!target) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  store.photos = store.photos.filter((photo) => photo.id !== id);

  store.galleries = store.galleries.map((gallery) => {
    if (gallery.coverPhotoId === id) {
      const nextCover = store.photos.find((photo) => photo.galleryId === gallery.id)?.id ?? null;
      return { ...gallery, coverPhotoId: nextCover };
    }
    return gallery;
  });

  store.activity.unshift({
    id: createId("act"),
    message: "Deleted photo and removed from S3",
    at: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
