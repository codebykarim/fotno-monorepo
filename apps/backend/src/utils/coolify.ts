const COOLIFY_BASE_URL = process.env.COOLIFY_API_URL || "";
const COOLIFY_TOKEN = process.env.COOLIFY_API_TOKEN || "";
const COOLIFY_APP_UUID = process.env.COOLIFY_GALLERY_APP_UUID || "";
const GALLERY_SERVICE_NAME = "gallery";

async function coolifyFetch(path: string, options: RequestInit = {}) {
  if (!COOLIFY_BASE_URL || !COOLIFY_TOKEN) {
    throw new Error("Coolify API is not configured");
  }

  const res = await fetch(`${COOLIFY_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${COOLIFY_TOKEN}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Coolify API error (${res.status}): ${text}`);
  }

  return res.json();
}

/**
 * Get the current docker_compose_domains for the app.
 */
async function getComposeDomains(): Promise<
  Array<{ name: string; domain: string }>
> {
  const app = await coolifyFetch(`/api/v1/applications/${COOLIFY_APP_UUID}`);
  let raw = app.docker_compose_domains;

  // Coolify returns it as a JSON string, so parse it
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return [];
    }
  }

  // Convert object format { "gallery": { "domain": "..." } } to array
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return Object.entries(raw).map(([name, val]: [string, any]) => ({
      name,
      domain: typeof val === "string" ? val : val?.domain || "",
    }));
  }
  if (Array.isArray(raw)) return raw;
  return [];
}

/**
 * Get the current domains for the gallery service.
 */
function getGalleryDomains(
  composeDomains: Array<{ name: string; domain: string }>,
): string[] {
  const entry = composeDomains.find((d) => d.name === GALLERY_SERVICE_NAME);
  if (!entry || !entry.domain) return [];
  return entry.domain
    .split(",")
    .map((d: string) => d.trim())
    .filter(Boolean);
}

/**
 * Update the gallery service domains in the docker compose app.
 */
async function updateGalleryDomains(
  composeDomains: Array<{ name: string; domain: string }>,
  newDomains: string[],
): Promise<void> {
  const updated = composeDomains.map((entry) => {
    if (entry.name === GALLERY_SERVICE_NAME) {
      return { ...entry, domain: newDomains.join(",") };
    }
    return entry;
  });

  // If gallery entry didn't exist, add it
  if (!updated.find((d) => d.name === GALLERY_SERVICE_NAME)) {
    updated.push({ name: GALLERY_SERVICE_NAME, domain: newDomains.join(",") });
  }

  await coolifyFetch(`/api/v1/applications/${COOLIFY_APP_UUID}`, {
    method: "PATCH",
    body: JSON.stringify({ docker_compose_domains: updated }),
  });
}

/**
 * Add a custom domain to the gallery service in Coolify.
 * Coolify + Traefik will auto-provision a Let's Encrypt SSL cert.
 */
export async function addDomainToCoolify(domain: string): Promise<void> {
  if (!COOLIFY_APP_UUID) return;

  const fqdn = `https://${domain}`;
  const composeDomains = await getComposeDomains();
  const current = getGalleryDomains(composeDomains);

  if (current.includes(fqdn)) return;

  current.push(fqdn);
  await updateGalleryDomains(composeDomains, current);
}

/**
 * Remove a custom domain from the gallery service in Coolify.
 */
export async function removeDomainFromCoolify(domain: string): Promise<void> {
  if (!COOLIFY_APP_UUID) return;

  const fqdn = `https://${domain}`;
  const composeDomains = await getComposeDomains();
  const current = getGalleryDomains(composeDomains);
  const filtered = current.filter((d) => d !== fqdn);

  if (filtered.length === current.length) return;

  await updateGalleryDomains(composeDomains, filtered);
}
