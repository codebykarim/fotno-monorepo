import { GalleryDetailProvider } from "@/components/dashboard/gallery-detail-provider";
import { GalleryDetailHeader } from "@/components/dashboard/gallery-detail-header";
import { GalleryProcessingBanner } from "@/components/dashboard/gallery-processing-banner";

export default async function GalleryDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <GalleryDetailProvider galleryId={id}>
      <div className="space-y-5">
        <GalleryDetailHeader />
        <GalleryProcessingBanner />
        {children}
      </div>
    </GalleryDetailProvider>
  );
}
