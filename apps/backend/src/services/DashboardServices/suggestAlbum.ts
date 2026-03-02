import { db } from "./_shared";

const IMAGE_SEARCH_SERVICE_URL =
  process.env.IMAGE_SEARCH_SERVICE_URL ;

  console.log(IMAGE_SEARCH_SERVICE_URL)

interface SuggestAlbumResponse {
  photoIds: string[];
  albumTitle?: string;
  albumDescription?: string;
  cached: boolean;
}

export const suggestAlbum = async (
  userId: string,
  galleryId: string,
  prompt: string,
) => {
  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { id: true },
  });

  if (!gallery) {
    console.log("Gallery not found");
    return { error: "Gallery not found", status: 404 as const };
  }

  if (!prompt || !prompt.trim()) {
    console.log("Prompt is required");
    return { error: "Prompt is required", status: 400 as const };
  }

  try {
    const response = await fetch(`${IMAGE_SEARCH_SERVICE_URL}/suggest-album`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        galleryId,
        prompt: prompt.trim(),
        albumSize: 50,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("ImageSearchService suggest-album error:", error);
      return {
        error: "Failed to get album suggestion from ImageSearchService",
        status: 500 as const,
      };
    }

    const data = (await response.json()) as SuggestAlbumResponse;

    // Validate that returned photoIds exist in the gallery
    const validPhotoIds = await db.photo.findMany({
      where: {
        galleryId,
        id: { in: data.photoIds },
      },
      select: { id: true },
    });

    const validIds = new Set(validPhotoIds.map((p: { id: string }) => p.id));
    const suggestedPhotoIds = data.photoIds.filter((id) => validIds.has(id));

    return {
      suggestedPhotoIds,
      albumTitle: data.albumTitle,
      albumDescription: data.albumDescription,
      status: 200 as const,
    };
  } catch (error) {
    console.error("ImageSearchService Error:", error);
    return {
      error: "Failed to communicate with ImageSearchService",
      status: 500 as const,
    };
  }
};
