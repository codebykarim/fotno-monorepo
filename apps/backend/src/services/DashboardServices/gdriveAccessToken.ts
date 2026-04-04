import { getDriveAccessToken, hasDriveScope } from "./gdriveTokenManager";

export const gdriveAccessToken = async (userId: string) => {
  const connected = await hasDriveScope(userId);
  if (!connected) {
    return { error: "Google Drive not connected", status: 401 as const };
  }

  const accessToken = await getDriveAccessToken(userId);
  return { accessToken };
};
