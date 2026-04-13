/**
 * Detect country from IP address using a free geo-IP API.
 * Results are cached in memory so each unique IP is looked up only once.
 */
const countryCache = new Map<string, string | null>();

/** Check if IP is in the 172.16.0.0/12 private range (172.16.x.x – 172.31.x.x) */
function isPrivate172(ip: string): boolean {
  if (!ip.startsWith("172.")) return false;
  const second = parseInt(ip.split(".")[1], 10);
  return second >= 16 && second <= 31;
}

export async function detectCountryFromIP(
  ip: string | undefined,
): Promise<string | null> {
  if (!ip) return null;

  // Strip IPv6-mapped IPv4 prefix
  const cleanIp = ip.replace(/^::ffff:/, "");

  // Skip private/local IPs (RFC 1918 + loopback)
  if (
    cleanIp === "127.0.0.1" ||
    cleanIp === "::1" ||
    cleanIp.startsWith("192.168.") ||
    cleanIp.startsWith("10.") ||
    isPrivate172(cleanIp)
  ) {
    return null;
  }

  if (countryCache.has(cleanIp)) {
    return countryCache.get(cleanIp) ?? null;
  }

  try {
    // ip-api.com: free tier, 45 req/min, no Cloudflare blocking
    const res = await fetch(
      `http://ip-api.com/json/${cleanIp}?fields=status,countryCode`,
      { signal: AbortSignal.timeout(3000) },
    );
    const json = await res.json();
    const country =
      json.status === "success" && json.countryCode?.length === 2
        ? json.countryCode.toUpperCase()
        : null;
    countryCache.set(cleanIp, country);
    return country;
  } catch {
    // Don't block on geo-IP failure
    countryCache.set(cleanIp, null);
    return null;
  }
}
