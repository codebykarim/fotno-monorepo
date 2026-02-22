import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PhotoLightboxClient from "@/components/gallery/photo-lightbox-client";
import { getGalleryByShareToken } from "@/lib/gallery-service";

export const revalidate = 60;

type PhotoPageProps = {
  params: Promise<{ shareToken: string; photoId: string }>;
};

export async function generateMetadata({ params }: PhotoPageProps): Promise<Metadata> {
  const { shareToken, photoId } = await params;
  const galleryBaseUrl =
    process.env.NEXT_PUBLIC_GALLERY_URL ?? "https://gallery.fotno.com";

  try {
    const { gallery } = await getGalleryByShareToken(shareToken, {
      revalidate: 60,
      cache: "force-cache",
    });
    const current = gallery.photos.find((photo) => photo.id === photoId);

    return {
      title: current ? `${gallery.title} • Photo` : `${gallery.title} | FOTNO Gallery`,
      description: current?.aiCaption ?? `Photo from ${gallery.title}`,
      openGraph: {
        title: gallery.title,
        description: current?.aiCaption ?? `Photo by ${gallery.photographer.name}`,
        images: current?.previewSrc
          ? [
              {
                url: `${galleryBaseUrl}${current.previewSrc.startsWith("/") ? current.previewSrc : `/${current.previewSrc}`}`,
              },
            ]
          : undefined,
      },
    };
  } catch {
    return {
      title: "FOTNO Gallery",
    };
  }
}

export default async function PhotoPage({ params }: PhotoPageProps) {
  const { shareToken, photoId } = await params;
  try {
    const { gallery } = await getGalleryByShareToken(shareToken, {
      revalidate: 60,
      cache: "force-cache",
    });

    if (!gallery.hasPassword && !gallery.photos.some((photo) => photo.id === photoId)) {
      notFound();
    }

    return <PhotoLightboxClient initialGallery={gallery} currentPhotoId={photoId} />;
  } catch {
    notFound();
  }
}
