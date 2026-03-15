import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSharedFavorites } from "@/lib/gallery-service";
import SharedFavoritesPageClient from "@/components/gallery/shared-favorites-page-client";

type Props = {
  params: Promise<{ favoriteShareToken: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { favoriteShareToken } = await params;
  try {
    const data = await getSharedFavorites(favoriteShareToken);
    return {
      title: `${data.viewerName}'s Favorites — ${data.gallery.title} | FOTNO`,
      description: `${data.viewerName}'s favorite photos from ${data.gallery.title}`,
    };
  } catch {
    return { title: "Shared Favorites | FOTNO" };
  }
}

export default async function SharedFavoritesPage({ params }: Props) {
  const { favoriteShareToken } = await params;
  try {
    const data = await getSharedFavorites(favoriteShareToken);
    return (
      <SharedFavoritesPageClient
        data={data}
        favoriteShareToken={favoriteShareToken}
      />
    );
  } catch {
    notFound();
  }
}
