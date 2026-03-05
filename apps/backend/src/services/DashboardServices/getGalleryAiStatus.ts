import { db } from "./_shared";

const IMAGE_SEARCH_SERVICE_URL = process.env.IMAGE_SEARCH_SERVICE_URL;

export const getGalleryAiStatus = async (
  userId: string,
  galleryId: string,
) => {
  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { id: true },
  });

  if (!gallery) {
    return { error: "Gallery not found", status: 404 as const };
  }

  const totalPhotos = await db.photo.count({
    where: { galleryId, status: "processed" },
  });

  try {
    const response = await fetch(
      `${IMAGE_SEARCH_SERVICE_URL}/gallery-status/${galleryId}`,
    );

    if (!response.ok) {
      return {
        error: "Failed to get status from ImageSearchService",
        status: 500 as const,
      };
    }

    const imageSearchStatus = (await response.json()) as {
      total: number;
      embedded: number;
      captioned: number;
      failed: number;
      ready: boolean;
    };

    return {
      totalPhotos,
      ingested: imageSearchStatus.total,
      embedded: imageSearchStatus.embedded,
      captioned: imageSearchStatus.captioned,
      failed: imageSearchStatus.failed,
      ready: imageSearchStatus.ready && imageSearchStatus.total >= totalPhotos,
      status: 200 as const,
    };
  } catch (error) {
    console.error("ImageSearchService status error:", error);
    return {
      error: "Failed to communicate with ImageSearchService",
      status: 500 as const,
    };
  }
};
