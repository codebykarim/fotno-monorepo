import { getPhotosAccessToken, hasPhotosScope } from "./gdriveTokenManager";

const PICKER_API = "https://photospicker.googleapis.com/v1";

export const gphotosSessionStatus = async (userId: string, sessionId: string) => {
  const connected = await hasPhotosScope(userId);
  if (!connected) {
    return { error: "Google Photos not connected", status: 403 as const };
  }

  const accessToken = await getPhotosAccessToken(userId);

  const res = await fetch(`${PICKER_API}/sessions/${sessionId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[gphotos-session-status]", res.status, text);
    return { error: `Picker API error: ${res.status}`, status: 500 as const };
  }

  const session = (await res.json()) as {
    id: string;
    mediaItemsSet: boolean;
    expireTime: string;
  };

  return {
    sessionId: session.id,
    mediaItemsSet: session.mediaItemsSet,
    expireTime: session.expireTime,
  };
};
