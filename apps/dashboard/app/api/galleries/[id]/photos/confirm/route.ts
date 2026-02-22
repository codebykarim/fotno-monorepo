import { NextRequest, NextResponse } from "next/server";
import { createId, getStore } from "@/lib/mocks/data-store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const store = getStore();
  const body = await request.json();

  const uploadId = body.uploadId as string;
  const ticket = store.uploadTickets.find((item) => item.uploadId === uploadId && item.galleryId === id);

  if (!ticket || !ticket.uploaded) {
    return NextResponse.json({ error: "Upload not completed" }, { status: 400 });
  }

  const order =
    store.photos
      .filter((photo) => photo.galleryId === id)
      .reduce((max, photo) => Math.max(max, photo.order), 0) + 1;

  const photo = {
    id: createId("photo"),
    galleryId: id,
    url: `https://picsum.photos/seed/${uploadId}/1200/1600`,
    order,
    width: 1200,
    height: 1600,
    createdAt: new Date().toISOString(),
  };

  store.photos.push(photo);

  const galleryIndex = store.galleries.findIndex((gallery) => gallery.id === id);
  const currentGallery = galleryIndex >= 0 ? store.galleries[galleryIndex] : undefined;
  if (currentGallery && !currentGallery.coverPhotoId) {
    store.galleries[galleryIndex] = {
      ...currentGallery,
      coverPhotoId: photo.id,
      updatedAt: new Date().toISOString(),
    };
  }

  store.activity.unshift({
    id: createId("act"),
    message: `Uploaded ${body.fileName || ticket.fileName} to gallery`,
    at: new Date().toISOString(),
  });

  return NextResponse.json({ photo }, { status: 201 });
}
