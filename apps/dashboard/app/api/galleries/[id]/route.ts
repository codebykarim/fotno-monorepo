import { NextRequest, NextResponse } from "next/server";
import { createId, getStore } from "@/lib/mocks/data-store";
import { getGalleryWithPhotos, updateGallery } from "@/lib/api/server";
import { Gallery } from "@/lib/types/gallery";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const gallery = getGalleryWithPhotos(id);
  if (!gallery) {
    return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
  }

  return NextResponse.json({ gallery });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const patch: Partial<Gallery> = {};

  if (typeof body.title === "string") {
    patch.title = body.title;
  }
  if (typeof body.slug === "string") {
    patch.slug = body.slug;
  }
  if (typeof body.coverPhotoId === "string" || body.coverPhotoId === null) {
    patch.coverPhotoId = body.coverPhotoId;
  }
  if (typeof body.passwordEnabled === "boolean") {
    patch.passwordEnabled = body.passwordEnabled;
    patch.password = body.passwordEnabled ? String(body.password ?? "") : null;
  }
  if (typeof body.isPublished === "boolean") {
    patch.isPublished = body.isPublished;
  }

  const updated = updateGallery(id, patch);
  if (!updated) {
    return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
  }

  getStore().activity.unshift({
    id: createId("act"),
    message: `Updated gallery ${updated.title}`,
    at: new Date().toISOString(),
  });

  return NextResponse.json({ gallery: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const store = getStore();

  const galleryIndex = store.galleries.findIndex((gallery) => gallery.id === id);
  if (galleryIndex === -1) {
    return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
  }

  const [removed] = store.galleries.splice(galleryIndex, 1);
  if (!removed) {
    return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
  }
  store.photos = store.photos.filter((photo) => photo.galleryId !== id);

  store.clients = store.clients.map((client) => ({
    ...client,
    galleryIds: client.galleryIds.filter((galleryId) => galleryId !== id),
  }));

  store.activity.unshift({
    id: createId("act"),
    message: `Deleted gallery ${removed.title} and queued S3 cleanup job`,
    at: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, cleanupEnqueued: true });
}
