import { AlbumConfigForm } from "@/components/smart-albums/album-config-form";
import { ProductList } from "@/components/smart-albums/product-list";
import { SubmissionList } from "@/components/smart-albums/submission-list";

export default async function GallerySmartAlbumsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: galleryId } = await params;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Smart Albums</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Allow clients to design and order physical photo albums from this gallery
        </p>
      </div>

      <AlbumConfigForm />

      <ProductList />

      <div className="pt-4 border-t">
        <h3 className="text-lg font-semibold mb-4">Submissions</h3>
        <SubmissionList galleryId={galleryId} basePath={`/galleries/${galleryId}/smart-albums/submissions`} />
      </div>
    </div>
  );
}
