const CF_API = "https://api.cloudflare.com/client/v4";

function getConfig() {
  const zoneId = process.env.CLOUDFLARE_ZONE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!zoneId || !apiToken) {
    throw new Error(
      "CLOUDFLARE_ZONE_ID and CLOUDFLARE_API_TOKEN must be set when custom domains are enabled",
    );
  }
  return { zoneId, apiToken };
}

function headers(apiToken: string) {
  return {
    Authorization: `Bearer ${apiToken}`,
    "Content-Type": "application/json",
  };
}

/** Create a custom hostname in Cloudflare for SaaS. Returns the hostname ID. */
export async function createCustomHostname(
  domain: string,
): Promise<string> {
  const { zoneId, apiToken } = getConfig();

  const res = await fetch(
    `${CF_API}/zones/${zoneId}/custom_hostnames`,
    {
      method: "POST",
      headers: headers(apiToken),
      body: JSON.stringify({
        hostname: domain,
        ssl: {
          method: "http",
          type: "dv",
          settings: {
            min_tls_version: "1.2",
          },
        },
      }),
    },
  );

  const data = await res.json();
  if (!data.success) {
    const msg = data.errors?.map((e: any) => e.message).join(", ") || "Unknown error";
    throw new Error(`Cloudflare create custom hostname failed: ${msg}`);
  }

  return data.result.id as string;
}

/** Delete a custom hostname from Cloudflare. */
export async function deleteCustomHostname(
  hostnameId: string,
): Promise<void> {
  const { zoneId, apiToken } = getConfig();

  const res = await fetch(
    `${CF_API}/zones/${zoneId}/custom_hostnames/${hostnameId}`,
    {
      method: "DELETE",
      headers: headers(apiToken),
    },
  );

  const data = await res.json();
  if (!data.success) {
    const msg = data.errors?.map((e: any) => e.message).join(", ") || "Unknown error";
    throw new Error(`Cloudflare delete custom hostname failed: ${msg}`);
  }
}
