export const isJwtLikelyValid = (token: string): boolean => {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) {
      return false;
    }

    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(normalized));

    if (typeof payload.exp !== "number") {
      return false;
    }

    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const getSessionTokenKey = (shareToken: string): string =>
  `fotno_gallery_jwt_${shareToken}`;
