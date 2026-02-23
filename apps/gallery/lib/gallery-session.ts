import crypto from "crypto";

type SessionPayload = {
  sub: string;
  exp: number;
  pwd: string;
};

const SESSION_SECRET = process.env.GALLERY_SESSION_SECRET ?? "fotno-dev-secret";

const encodeBase64Url = (value: string): string =>
  Buffer.from(value).toString("base64url");

const decodeBase64Url = (value: string): string =>
  Buffer.from(value, "base64url").toString("utf8");

const sign = (header: string, payload: string): string =>
  crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");

const normalizePassword = (password: string | null): string =>
  password ?? "__no_password__";

export const getPasswordFingerprint = (
  shareToken: string,
  password: string | null,
): string =>
  crypto
    .createHash("sha256")
    .update(`${shareToken}:${normalizePassword(password)}`)
    .digest("hex");

export const createGallerySessionToken = (params: {
  shareToken: string;
  password: string | null;
  ttlSeconds?: number;
}): string => {
  const header = encodeBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = encodeBase64Url(
    JSON.stringify({
      sub: params.shareToken,
      exp: Math.floor(Date.now() / 1000) + (params.ttlSeconds ?? 60 * 60),
      pwd: getPasswordFingerprint(params.shareToken, params.password),
    } satisfies SessionPayload),
  );

  const signature = sign(header, payload);
  return `${header}.${payload}.${signature}`;
};

export const verifyGallerySessionToken = (params: {
  token: string;
  shareToken: string;
  password: string | null;
}): boolean => {
  try {
    const [headerPart, payloadPart, signaturePart] = params.token.split(".");
    if (!headerPart || !payloadPart || !signaturePart) {
      return false;
    }

    const expectedSignature = sign(headerPart, payloadPart);
    if (signaturePart !== expectedSignature) {
      return false;
    }

    const payload = JSON.parse(decodeBase64Url(payloadPart)) as SessionPayload;

    if (payload.sub !== params.shareToken || payload.exp * 1000 <= Date.now()) {
      return false;
    }

    const expectedPasswordFingerprint = getPasswordFingerprint(
      params.shareToken,
      params.password,
    );

    return payload.pwd === expectedPasswordFingerprint;
  } catch {
    return false;
  }
};
