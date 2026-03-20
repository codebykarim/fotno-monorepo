/**
 * Detect country from IP address using a free geo-IP API.
 * Results are cached in memory so each unique IP is looked up only once.
 */
const countryCache = new Map<string, string | null>();

export async function detectCountryFromIP(
  ip: string | undefined,
): Promise<string | null> {
  if (!ip) return null;

  // Strip IPv6-mapped IPv4 prefix
  const cleanIp = ip.replace(/^::ffff:/, "");

  // Skip private/local IPs
  if (
    cleanIp === "127.0.0.1" ||
    cleanIp === "::1" ||
    cleanIp.startsWith("192.168.") ||
    cleanIp.startsWith("10.") ||
    cleanIp.startsWith("172.")
  ) {
    return null;
  }

  if (countryCache.has(cleanIp)) {
    return countryCache.get(cleanIp) ?? null;
  }

  try {
    const res = await fetch(`https://ipapi.co/${cleanIp}/country/`, {
      signal: AbortSignal.timeout(3000),
    });
    const text = await res.text();
    const country =
      text && text.length === 2 ? text.toUpperCase() : null;
    countryCache.set(cleanIp, country);
    return country;
  } catch {
    // Don't block pricing on geo-IP failure
    countryCache.set(cleanIp, null);
    return null;
  }
}
