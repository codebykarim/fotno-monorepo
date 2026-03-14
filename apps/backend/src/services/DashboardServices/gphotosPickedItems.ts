import { getPhotosAccessToken, hasPhotosScope } from "./gdriveTokenManager";

const PICKER_API = "https://photospicker.googleapis.com/v1";

interface PickedMediaItem {
  id: string;
  type: "PHOTO" | "VIDEO";
  mediaFile: {
    baseUrl: string;
    mimeType: string;
    filename: string;
  };
}

export const gphotosPickedItems = async (userId: string, sessionId: string) => {
  const connected = await hasPhotosScope(userId);
  if (!connected) {
    return { error: "Google Photos not connected", status: 403 as const };
  }

  const accessToken = await getPhotosAccessToken(userId);

  const all: PickedMediaItem[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({ sessionId, pageSize: "100" });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(`${PICKER_API}/mediaItems?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[gphotos-picked-items]", res.status, text);
      return { error: `Picker API error: ${res.status}`, status: 500 as const };
    }

    const data = (await res.json()) as {
      mediaItems?: PickedMediaItem[];
      nextPageToken?: string;
    };

    all.push(...(data.mediaItems ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  // Filter to photos only, return thumbnails
  const photos = all
    .filter((item) => item.type === "PHOTO")
    .map((item) => ({
      id: item.id,
      filename: item.mediaFile.filename,
      mimeType: item.mediaFile.mimeType,
      baseUrl: item.mediaFile.baseUrl,
    }));

  return { photos, totalCount: photos.length };
};
