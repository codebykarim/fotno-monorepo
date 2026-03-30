import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

// Disable sharp cache — each invocation processes a single image
sharp.cache(false);
// Single thread — Lambda vCPU scales with memory, no need to over-parallelize
sharp.concurrency(1);

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET = process.env.AWS_S3_BUCKET!;
const MAX_INPUT_PIXELS = Number(
  process.env.IMAGE_PROCESSOR_MAX_PIXELS ?? 100_000_000,
);

// ── Types ────────────────────────────────────────────────────────────

type ProcessingEvent = {
  s3Key: string;
  photoId: string;
  thumbnailMaxBytes: number;
  previewMaxBytes: number;
};

type ProcessingResult = {
  thumbnailKey: string;
  previewKey: string;
  thumbnailSize: number;
  previewSize: number;
  width: number | null;
  height: number | null;
  originalSize: number;
  format: string;
  blurDataUrl: string;
};

// ── Compression ──────────────────────────────────────────────────────

const compressWebpUnderBudget = async (
  sourceBuffer: Buffer,
  targetWidth: number,
  minWidth: number,
  maxBytes: number,
  initialQuality: number,
  minQuality: number,
): Promise<Buffer> => {
  let width = targetWidth;
  let quality = initialQuality;

  // Resize once — avoids re-decoding the large original on each quality attempt
  let resized = await sharp(sourceBuffer, { failOnError: false })
    .resize({ width, fit: "inside", withoutEnlargement: true })
    .toBuffer();

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const candidate = await sharp(resized, { failOnError: false })
      .webp({ quality, effort: 4 })
      .toBuffer();

    if (candidate.length <= maxBytes) {
      return candidate;
    }

    if (quality > minQuality) {
      quality = Math.max(minQuality, quality - 8);
      continue;
    }

    // Quality exhausted — downscale from original
    const nextWidth = Math.floor(width * 0.85);
    if (nextWidth < minWidth) break;

    width = nextWidth;
    quality = initialQuality;
    resized = await sharp(sourceBuffer, { failOnError: false })
      .resize({ width, fit: "inside", withoutEnlargement: true })
      .toBuffer();
  }

  const fallback = await sharp(resized, { failOnError: false })
    .webp({ quality: minQuality, effort: 4 })
    .toBuffer();

  if (fallback.length > maxBytes) {
    throw new Error(`Unable to compress image under ${maxBytes} bytes`);
  }

  return fallback;
};

// ── Handler ──────────────────────────────────────────────────────────

export const handler = async (
  event: ProcessingEvent,
): Promise<ProcessingResult> => {
  const startedAt = Date.now();
  console.log(
    `[lambda] start photoId=${event.photoId} s3Key=${event.s3Key}`,
  );

  // Download original from S3
  const getResponse = await s3.send(
    new GetObjectCommand({ Bucket: BUCKET, Key: event.s3Key }),
  );
  const originalBuffer = Buffer.from(
    await getResponse.Body!.transformToByteArray(),
  );
  console.log(
    `[lambda] downloaded photoId=${event.photoId} bytes=${originalBuffer.length}`,
  );

  // Validate image
  const metadata = await sharp(originalBuffer, {
    failOnError: true,
    limitInputPixels: MAX_INPUT_PIXELS,
  }).metadata();

  if (!metadata.format) {
    throw new Error("Unrecognizable image format");
  }

  const pixels = (metadata.width ?? 0) * (metadata.height ?? 0);
  if (pixels > MAX_INPUT_PIXELS) {
    throw new Error(
      `Image too large: ${metadata.width}x${metadata.height} = ${pixels}px (max ${MAX_INPUT_PIXELS})`,
    );
  }

  console.log(
    `[lambda] metadata photoId=${event.photoId} format=${metadata.format} ${metadata.width}x${metadata.height}`,
  );

  const originalWidth = metadata.width ?? 2400;
  const previewTargetWidth = Math.min(2400, Math.max(1600, originalWidth));
  const thumbnailTargetWidth = Math.min(
    700,
    Math.max(480, Math.floor(originalWidth / 3)),
  );

  // Generate thumbnail then preview (sequential to keep memory predictable)
  const thumbnailBuffer = await compressWebpUnderBudget(
    originalBuffer,
    thumbnailTargetWidth,
    320,
    event.thumbnailMaxBytes,
    84,
    50,
  );

  const previewBuffer = await compressWebpUnderBudget(
    originalBuffer,
    previewTargetWidth,
    960,
    event.previewMaxBytes,
    86,
    54,
  );

  // Tiny blur placeholder for gallery UI (16px wide, ~300-500 chars base64)
  const blurBuffer = await sharp(originalBuffer, { failOnError: false })
    .resize(16, undefined, { fit: "inside" })
    .webp({ quality: 20 })
    .toBuffer();
  const blurDataUrl = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

  const thumbnailKey = `thumbnails/${event.photoId}.webp`;
  const previewKey = `previews/${event.photoId}.webp`;

  // Upload both to S3
  await Promise.all([
    s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: thumbnailKey,
        Body: thumbnailBuffer,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
        StorageClass: "INTELLIGENT_TIERING",
      }),
    ),
    s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: previewKey,
        Body: previewBuffer,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
        StorageClass: "INTELLIGENT_TIERING",
      }),
    ),
  ]);

  const durationMs = Date.now() - startedAt;
  console.log(
    `[lambda] done photoId=${event.photoId} thumbnail=${thumbnailBuffer.length}B preview=${previewBuffer.length}B ${durationMs}ms`,
  );

  return {
    thumbnailKey,
    previewKey,
    thumbnailSize: thumbnailBuffer.length,
    previewSize: previewBuffer.length,
    width: metadata.width ?? null,
    height: metadata.height ?? null,
    originalSize: originalBuffer.length,
    format: metadata.format,
    blurDataUrl,
  };
};
