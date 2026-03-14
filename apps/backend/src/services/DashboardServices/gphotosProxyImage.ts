import { getPhotosAccessToken, hasPhotosScope } from "./gdriveTokenManager";

export const gphotosProxyImage = async (userId: string, url: string) => {
  if (!url) {
    return { error: "Missing url parameter", status: 400 as const };
  }

  // Only allow proxying Google Photos URLs
  if (!url.startsWith("https://lh3.googleusercontent.com/")) {
    return { error: "Invalid image URL", status: 400 as const };
  }

  const connected = await hasPhotosScope(userId);
  if (!connected) {
    return { error: "Google Photos not connected", status: 403 as const };
  }

  const accessToken = await getPhotosAccessToken(userId);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    return { error: `Image fetch failed: ${res.status}`, status: res.status as 400 };
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") ?? "image/jpeg";

  return { buffer, contentType };
};
