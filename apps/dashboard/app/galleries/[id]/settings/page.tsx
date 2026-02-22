import { GalleryDetailContent } from "@/components/dashboard/gallery-detail-content";

export default async function GallerySettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <GalleryDetailContent galleryId={id} initialTab="settings" />;
}
