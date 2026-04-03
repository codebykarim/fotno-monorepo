export function getGalleryShareLink(
  slug: string,
  customDomain?: string | null,
) {
  // If user has a verified custom domain, use it
  if (customDomain) {
    return `https://${customDomain}/${slug}`;
  }

  const configuredGalleryUrl = process.env.NEXT_PUBLIC_GALLERY_URL?.replace(
    /\/$/,
    "",
  );
  const buildShareUrl = (baseUrl: string) =>
    `${baseUrl.replace(/\/$/, "")}/${slug}`;

  const mapLocalhostToCurrentHost = (urlString: string): string => {
    if (typeof window === "undefined") return urlString;
    try {
      const parsed = new URL(urlString);
      if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
        parsed.hostname = window.location.hostname;
      }
      return parsed.toString().replace(/\/$/, "");
    } catch {
      return urlString;
    }
  };

  if (configuredGalleryUrl)
    return buildShareUrl(mapLocalhostToCurrentHost(configuredGalleryUrl));
  if (typeof window === "undefined")
    return buildShareUrl("http://localhost:3003");

  const inferredBaseUrl =
    window.location.port === "3001"
      ? `${window.location.protocol}//${window.location.hostname}:3003`
      : window.location.origin;

  return buildShareUrl(inferredBaseUrl);
}

export function getGalleryBaseUrl(customDomain?: string | null): string {
  if (customDomain) {
    return `https://${customDomain}`;
  }
  return (
    process.env.NEXT_PUBLIC_GALLERY_URL ?? "http://localhost:3003"
  ).replace(/\/$/, "");
}
