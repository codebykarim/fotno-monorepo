import { hasPhotosScope } from "./gdriveTokenManager";

export const gphotosAuthStatus = async (userId: string) => {
  const connected = await hasPhotosScope(userId);
  return { connected };
};
