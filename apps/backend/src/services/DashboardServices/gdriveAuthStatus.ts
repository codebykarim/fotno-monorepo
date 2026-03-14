import { hasDriveScope } from "./gdriveTokenManager";

export const gdriveAuthStatus = async (userId: string) => {
  const connected = await hasDriveScope(userId);
  return { connected };
};
