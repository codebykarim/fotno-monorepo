import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl as getS3SignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSignedUrl as getCfSignedUrl } from "@aws-sdk/cloudfront-signer";

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET;

if (!region) {
  throw new Error("Missing AWS_REGION environment variable");
}

if (!bucket) {
  throw new Error("Missing AWS_S3_BUCKET environment variable");
}

const s3Client = new S3Client({
  region,
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

/** PEM from .env is often one line with a space after BEGIN / before END; OpenSSL requires newlines. */
function normalizePemPrivateKey(raw: string): string {
  let s = raw.replace(/\\n/g, "\n").trim();
  s = s.replace(/(-----BEGIN [A-Z ]+-----)\s+(?=\S)/, "$1\n");
  s = s.replace(/\s+(-----END [A-Z ]+-----)/, "\n$1");
  return s;
}

// ── CloudFront configuration ─────────────────────────────────────
const cfDomain = process.env.CLOUDFRONT_DOMAIN;
const cfKeyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID;
const cfPrivateKey = process.env.CLOUDFRONT_PRIVATE_KEY
  ? normalizePemPrivateKey(process.env.CLOUDFRONT_PRIVATE_KEY)
  : undefined;
const useCloudFront = Boolean(cfDomain && cfKeyPairId && cfPrivateKey);

// ── Signed URL cache ─────────────────────────────────────────────
// CloudFront signing is CPU-heavy (RSA per URL). Cache results to avoid
// re-signing the same key repeatedly. Entries expire at half the URL
// lifetime so the browser always has a valid URL.
const signedUrlCache = new Map<string, { url: string; expiresAt: number }>();
const CACHE_MAX_SIZE = 5000;

function getCachedOrSign(key: string, expiresIn: number): string {
  const cacheKey = `${key}:${expiresIn}`;
  const cached = signedUrlCache.get(cacheKey);
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return cached.url;
  }

  const url = `https://${cfDomain}/${key}`;
  const dateLessThan = new Date(now + expiresIn * 1000).toISOString();

  const signedUrl = getCfSignedUrl({
    url,
    keyPairId: cfKeyPairId!,
    privateKey: cfPrivateKey!,
    dateLessThan,
  });

  // Evict oldest entries when cache is full
  if (signedUrlCache.size >= CACHE_MAX_SIZE) {
    const firstKey = signedUrlCache.keys().next().value;
    if (firstKey) signedUrlCache.delete(firstKey);
  }

  // Cache for half the expiry time so URLs are still valid when served
  signedUrlCache.set(cacheKey, {
    url: signedUrl,
    expiresAt: now + (expiresIn * 1000) / 2,
  });

  return signedUrl;
}

/**
 * Generates a signed URL for downloading an object.
 *
 * When CloudFront is configured (CLOUDFRONT_DOMAIN, CLOUDFRONT_KEY_PAIR_ID,
 * CLOUDFRONT_PRIVATE_KEY), returns a CloudFront signed URL — served from CDN
 * edge with zero S3 egress cost.
 *
 * Falls back to S3 presigned URLs when CloudFront is not configured.
 */
export const getPresignedDownloadUrl = async (
  key: string,
  expiresIn = 300,
): Promise<string> => {
  if (useCloudFront) {
    return getCachedOrSign(key, expiresIn);
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getS3SignedUrl(s3Client, command, { expiresIn });
};

/**
 * Deletes an object from S3 by key. Used by the cleanup worker when a user deletes a photo
 * or gallery to remove the original file, thumbnail, and preview.
 */
export const deleteS3Object = async (key: string): Promise<void> => {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
};
