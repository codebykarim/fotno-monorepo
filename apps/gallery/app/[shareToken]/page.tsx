import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GalleryPageClient from "@/components/gallery/gallery-page-client";
import { getGalleryByShareToken } from "@/lib/gallery-service";

export const revalidate = 60;

type ShareTokenPageProps = {
  params: Promise<{ shareToken: string }>;
};

export async function generateMetadata({
  params,
}: ShareTokenPageProps): Promise<Metadata> {
  const { shareToken } = await params;
  const galleryBaseUrl =
    process.env.NEXT_PUBLIC_GALLERY_URL ?? "https://gallery.fotno.com";

  try {
    const { gallery } = await getGalleryByShareToken(shareToken, {
      revalidate: 60,
      cache: "force-cache",
    });

    const cover = gallery.photos.find((photo) => photo.id === gallery.coverPhotoId);
    const imagePath = cover?.previewSrc ?? gallery.photos[0]?.previewSrc;
    const imageUrl = imagePath
      ? `${galleryBaseUrl}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`
      : undefined;

    return {
      title: `${gallery.title} | FOTNO Gallery`,
      description: `View ${gallery.title} from ${gallery.photographer.name}`,
      openGraph: {
        title: gallery.title,
        description: `Private photo gallery by ${gallery.photographer.name}`,
        images: imageUrl ? [{ url: imageUrl }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: gallery.title,
        description: `Private photo gallery by ${gallery.photographer.name}`,
        images: imageUrl ? [imageUrl] : undefined,
      },
    };
  } catch {
    return {
      title: "FOTNO Gallery",
      description: "Private gallery",
    };
  }
}

export default async function ShareTokenPage({ params }: ShareTokenPageProps) {
  const { shareToken } = await params;
  try {
    const { gallery } = await getGalleryByShareToken(shareToken, {
      revalidate: 60,
      cache: "force-cache",
    });

    return <GalleryPageClient initialGallery={gallery} />;
  } catch {
    notFound();
  }
}
