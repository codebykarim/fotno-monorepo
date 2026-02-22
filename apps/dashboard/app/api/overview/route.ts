import { NextResponse } from "next/server";
import { getStore } from "@/lib/mocks/data-store";

export async function GET() {
  const store = getStore();
  const galleries = store.galleries;
  const photos = store.photos;

  const totalStorageMb = photos.reduce((acc, photo) => {
    const estimatedBytes = photo.width * photo.height * 0.15;
    return acc + estimatedBytes / (1024 * 1024);
  }, 0);

  const recentActivity = [...store.activity]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 8);

  return NextResponse.json({
    totalGalleries: galleries.length,
    totalPhotos: photos.length,
    totalStorageUsedMb: Number(totalStorageMb.toFixed(2)),
    recentActivity,
  });
}
