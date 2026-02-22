import { NextResponse } from "next/server";
import { getStore } from "@/lib/mocks/data-store";

export async function GET() {
  const store = getStore();

  const clients = store.clients.map((client) => {
    const galleries = store.galleries.filter((gallery) => client.galleryIds.includes(gallery.id));

    return {
      ...client,
      galleries: galleries.map((gallery) => ({
        id: gallery.id,
        title: gallery.title,
      })),
    };
  });

  return NextResponse.json({ clients });
}
