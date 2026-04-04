import { OAuth2Client } from "google-auth-library";
import { db } from "./_shared";

function getOAuth2Client(): OAuth2Client {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth credentials not configured");
  }

  return new OAuth2Client(clientId, clientSecret);
}

export async function hasDriveScope(userId: string): Promise<boolean> {
  const account = await db.account.findFirst({
    where: { userId, providerId: "google" },
    select: { scope: true },
  });

  if (!account?.scope) return false;
  return account.scope.includes("drive.file");
}

export async function hasPhotosScope(userId: string): Promise<boolean> {
  const account = await db.account.findFirst({
    where: { userId, providerId: "google" },
    select: { scope: true },
  });

  if (!account?.scope) return false;
  return account.scope.includes("photospicker.mediaitems.readonly");
}

export async function getGoogleAccessToken(userId: string, requiredScope: string): Promise<string> {
  const account = await db.account.findFirst({
    where: { userId, providerId: "google" },
    select: {
      id: true,
      accessToken: true,
      refreshToken: true,
      accessTokenExpiresAt: true,
      scope: true,
    },
  });

  if (!account) throw new Error("No Google account linked");
  if (!account.scope?.includes(requiredScope)) throw new Error(`Scope ${requiredScope} not authorized`);

  const now = new Date();
  const expiresAt = account.accessTokenExpiresAt;
  const isExpired = !expiresAt || expiresAt.getTime() - now.getTime() < 60_000;

  if (!isExpired && account.accessToken) return account.accessToken;

  if (!account.refreshToken) throw new Error("No refresh token available — user must re-authorize");

  const client = getOAuth2Client();
  client.setCredentials({ refresh_token: account.refreshToken });
  const { credentials } = await client.refreshAccessToken();

  await db.account.update({
    where: { id: account.id },
    data: {
      accessToken: credentials.access_token ?? account.accessToken,
      accessTokenExpiresAt: credentials.expiry_date ? new Date(credentials.expiry_date) : undefined,
      ...(credentials.refresh_token ? { refreshToken: credentials.refresh_token } : {}),
    },
  });

  if (!credentials.access_token) throw new Error("Failed to refresh access token");
  return credentials.access_token;
}

export function getPhotosAccessToken(userId: string): Promise<string> {
  return getGoogleAccessToken(userId, "photospicker.mediaitems.readonly");
}

export async function getDriveAccessToken(userId: string): Promise<string> {
  return getGoogleAccessToken(userId, "drive.file");
}
