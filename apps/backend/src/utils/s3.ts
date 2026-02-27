import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.AWS_S3_ENDPOINT ?? process.env.R2_ENDPOINT;
const isR2Endpoint = typeof endpoint === "string" && endpoint.includes("r2.cloudflarestorage.com");
const region = process.env.AWS_REGION ?? (isR2Endpoint ? "auto" : undefined);
const bucket = process.env.AWS_S3_BUCKET;
const looksLikeAwsRegion = (value: string): boolean =>
  /^[a-z]{2}-[a-z]+-\d+$/.test(value);

if (!region) {
  throw new Error("Missing AWS_REGION environment variable");
}

if (!bucket) {
  throw new Error("Missing AWS_S3_BUCKET environment variable");
}

if (!endpoint && !looksLikeAwsRegion(region)) {
  throw new Error(
    "AWS_S3_ENDPOINT (or R2_ENDPOINT) is required when AWS_REGION is not a standard AWS region.",
  );
}

const s3Client = new S3Client({
  region,
  ...(endpoint ? { endpoint } : {}),
  forcePathStyle: Boolean(endpoint),
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

/**
 * Generates a presigned URL for downloading an S3/R2 object. Used to serve photos to the client
 * without exposing storage credentials. URLs expire after the given number of seconds.
 */
export const getPresignedDownloadUrl = async (
  key: string,
  expiresIn = 300,
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
};

/**
 * Deletes an object from S3/R2 by key. Used by the cleanup worker when a user deletes a photo
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
