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

// ── CloudFront configuration ─────────────────────────────────────
const cfDomain = process.env.CLOUDFRONT_DOMAIN;
const cfKeyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID;
const cfPrivateKey = process.env.CLOUDFRONT_PRIVATE_KEY?.replace(/\\n/g, "\n");
const useCloudFront = Boolean(cfDomain && cfKeyPairId && cfPrivateKey);

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
    const url = `https://${cfDomain}/${key}`;
    const dateLessThan = new Date(Date.now() + expiresIn * 1000).toISOString();
    return getCfSignedUrl({
      url,
      keyPairId: cfKeyPairId!,
      privateKey: cfPrivateKey!,
      dateLessThan,
    });
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
