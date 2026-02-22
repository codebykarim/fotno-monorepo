import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

/**
 * Generates a presigned URL for direct S3 uploads.
 */
export const getPresignedUploadUrl = async (
  key: string,
  mimeType: string,
  expiresIn = 300,
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: mimeType,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
};

/**
 * Generates a presigned URL for secure S3 downloads.
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
 * Deletes an object from S3.
 */
export const deleteS3Object = async (key: string): Promise<void> => {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
};

/**
 * Uploads binary content to S3.
 */
export const putS3Object = async (
  key: string,
  body: Buffer,
  contentType: string,
): Promise<void> => {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
};

/**
 * Downloads binary content from S3.
 */
export const getS3ObjectBuffer = async (key: string): Promise<Buffer> => {
  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );

  if (!response.Body) {
    throw new Error(`S3 object body is empty for key: ${key}`);
  }

  const bytes = await response.Body.transformToByteArray();
  return Buffer.from(bytes);
};

export const s3Config = {
  bucket,
  region,
};
