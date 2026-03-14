import { getPhotosAccessToken, hasPhotosScope } from "./gdriveTokenManager";
import { randomUUID } from "crypto";

const PICKER_API = "https://photospicker.googleapis.com/v1";

export const gphotosCreateSession = async (userId: string) => {
  const connected = await hasPhotosScope(userId);
  if (!connected) {
    return { error: "Google Photos not connected", status: 403 as const };
  }

  const accessToken = await getPhotosAccessToken(userId);

  const res = await fetch(`${PICKER_API}/sessions?requestId=${randomUUID()}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[gphotos-create-session]", res.status, text);
    return { error: `Picker API error: ${res.status}`, status: 500 as const };
  }

  const session = (await res.json()) as {
    id: string;
    pickerUri: string;
    pollingConfig: { pollInterval: string; timeoutIn: string };
    mediaItemsSet: boolean;
    expireTime: string;
  };

  return {
    sessionId: session.id,
    pickerUri: session.pickerUri,
    pollingConfig: session.pollingConfig,
    expireTime: session.expireTime,
  };
};
