import "../../backend/src/bootstrap";
import sharp from "sharp";
import { prisma } from "@workspace/db";
import { multipartService } from "../../upload-service/src/services/multipart";

const IMAGE_SEARCH_SERVICE_URL =
  process.env.IMAGE_SEARCH_SERVICE_URL || "http://localhost:4002";
const AI_ENABLED = process.env.AI_ENABLED !== 'false';

type CompressionOptions = {
  targetWidth: number;
  minWidth: number;
  maxBytes: number;
  initialQuality: number;
  minQuality: number;
};

type ProcessingPhoto = {
  id: string;
  s3Key: string;
  galleryId: string;
  aiCaption: string | null;
  aiTags: string[];
  gallery: {
    userId: string;
  };
};

const PREVIEW_MAX_BYTES = 1_000_000;
const THUMBNAIL_MAX_BYTES = 250_000;
const POLL_INTERVAL_MS = Number(process.env.IMAGE_PROCESSOR_POLL_MS ?? 3000);
const BATCH_SIZE = Number(process.env.IMAGE_PROCESSOR_BATCH_SIZE ?? 5);
const RETRY_FAILED = process.env.IMAGE_PROCESSOR_RETRY_FAILED === "true";
const PROCESSING_STALE_MS = Number(
  process.env.IMAGE_PROCESSOR_STALE_MS ?? 120_000,
);

const sleep = async (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const ingestPhotoToSearchService = async (
  photoId: string,
  userId: string,
  galleryId: string,
  previewKey: string,
  caption?: string | null,
  tags?: string[],
): Promise<void> => {
  try {
    const cfDomain = process.env.CLOUDFRONT_DOMAIN;
    const previewUrl = cfDomain ? `https://${cfDomain}/${previewKey}` : `/${previewKey}`;

    const response = await fetch(`${IMAGE_SEARCH_SERVICE_URL}/ingest-photo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        photoId,
        userId,
        galleryId,
        storageUrl: previewUrl,
        caption: caption ?? undefined,
        tags: tags ?? [],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.warn(
        `[image-processor] failed to ingest photo to search service photoId=${photoId} error=${error}`,
      );
    } else {
      console.log(
        `[image-processor] ingested to search service photoId=${photoId}`,
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.warn(
      `[image-processor] search service ingest failed photoId=${photoId} error=${message}`,
    );
  }
};

const addProcessingStorage = async (
  userId: string,
  bytes: bigint,
  photoId: string,
): Promise<void> => {
  const normalized = bytes < 0n ? 0n : bytes;

  await (prisma as any).$transaction(async (tx: any) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        storageUsed: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const currentUsed = BigInt(user.storageUsed ?? 0n);
    const newUsed = currentUsed + normalized;

    await tx.user.update({
      where: { id: userId },
      data: {
        storageUsed: newUsed,
      },
    });

    await tx.storageEvent.create({
      data: {
        userId,
        photoId,
        delta: normalized,
        reason: "processing",
      },
    });
  });
};

const compressWebpUnderBudget = async (
  sourceBuffer: Buffer,
  options: CompressionOptions,
): Promise<Buffer> => {
  let width = options.targetWidth;
  let quality = options.initialQuality;
  let lastResult: Buffer | null = null;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const candidate = await sharp(sourceBuffer)
      .resize({
        width,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality, effort: 5 })
      .toBuffer();

    lastResult = candidate;
    if (candidate.length <= options.maxBytes) {
      return candidate;
    }

    if (quality > options.minQuality) {
      quality = Math.max(options.minQuality, quality - 5);
      continue;
    }

    const nextWidth = Math.floor(width * 0.88);
    if (nextWidth < options.minWidth) {
      break;
    }

    width = nextWidth;
    quality = options.initialQuality;
  }

  if (!lastResult) {
    throw new Error("Failed to produce compressed image output");
  }

  if (lastResult.length > options.maxBytes) {
    throw new Error(`Unable to compress image under ${options.maxBytes} bytes`);
  }

  return lastResult;
};

const claimNextBatch = async (): Promise<ProcessingPhoto[]> => {
  const now = Date.now();
  const staleBefore = new Date(now - PROCESSING_STALE_MS);

  const claimableStatuses = RETRY_FAILED
    ? ["uploaded", "failed"]
    : ["uploaded"];

  const candidates = await (prisma as any).photo.findMany({
    where: {
      AND: [
        {
          OR: [
            { status: { in: claimableStatuses } },
            { status: "processing", createdAt: { lt: staleBefore } },
          ],
        },
        {
          OR: [{ previewKey: null }, { thumbnailKey: null }],
        },
      ],
    },
    orderBy: { createdAt: "asc" },
    take: BATCH_SIZE,
    select: {
      id: true,
      s3Key: true,
      galleryId: true,
      aiCaption: true,
      aiTags: true,
      gallery: {
        select: {
          userId: true,
        },
      },
    },
  });

  const claimed: ProcessingPhoto[] = [];

  for (const candidate of candidates) {
    const updated = await (prisma as any).photo.updateMany({
      where: {
        id: candidate.id,
        OR: [
          { status: { in: claimableStatuses } },
          { status: "processing", createdAt: { lt: staleBefore } },
        ],
      },
      data: {
        status: "processing",
      },
    });

    if (updated.count > 0) {
      claimed.push(candidate as ProcessingPhoto);
    }
  }

  return claimed;
};

const processPhoto = async (photo: ProcessingPhoto): Promise<void> => {
  const startedAt = Date.now();
  console.log(`[image-processor] started photoId=${photo.id}`);

  try {
    const originalBuffer = await multipartService.downloadToBuffer(photo.s3Key);
    const metadata = await sharp(originalBuffer).metadata();

    const thumbnailKey = `thumbnails/${photo.id}.webp`;
    const previewKey = `previews/${photo.id}.webp`;

    const originalWidth = metadata.width ?? 2400;
    const previewTargetWidth = Math.min(2400, Math.max(1600, originalWidth));
    const thumbnailTargetWidth = Math.min(
      700,
      Math.max(480, Math.floor(originalWidth / 3)),
    );

    const thumbnailBuffer = await compressWebpUnderBudget(originalBuffer, {
      targetWidth: thumbnailTargetWidth,
      minWidth: 320,
      maxBytes: THUMBNAIL_MAX_BYTES,
      initialQuality: 84,
      minQuality: 50,
    });

    const previewBuffer = await compressWebpUnderBudget(originalBuffer, {
      targetWidth: previewTargetWidth,
      minWidth: 960,
      maxBytes: PREVIEW_MAX_BYTES,
      initialQuality: 86,
      minQuality: 54,
    });

    await Promise.all([
      multipartService.uploadBuffer(thumbnailKey, thumbnailBuffer, "image/webp"),
      multipartService.uploadBuffer(previewKey, previewBuffer, "image/webp"),
    ]);

    await (prisma as any).photo.update({
      where: { id: photo.id },
      data: {
        thumbnailKey,
        previewKey,
        thumbnailSize: BigInt(thumbnailBuffer.length),
        previewSize: BigInt(previewBuffer.length),
        totalSize: BigInt(
          originalBuffer.length + thumbnailBuffer.length + previewBuffer.length,
        ),
        width: metadata.width ?? null,
        height: metadata.height ?? null,
        status: "processed",
      },
    });

    await addProcessingStorage(
      photo.gallery.userId,
      BigInt(thumbnailBuffer.length + previewBuffer.length),
      photo.id,
    );

    // Ingest to image search service for embedding
    if (AI_ENABLED) {
      void ingestPhotoToSearchService(
        photo.id,
        photo.gallery.userId,
        photo.galleryId,
        previewKey,
        photo.aiCaption,
        photo.aiTags,
      );
    }

    console.log(
      `[image-processor] completed photoId=${photo.id} previewBytes=${previewBuffer.length} thumbnailBytes=${thumbnailBuffer.length} durationMs=${Date.now() - startedAt}`,
    );
  } catch (error) {
    await (prisma as any).photo.update({
      where: { id: photo.id },
      data: { status: "failed" },
    });

    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(
      `[image-processor] failed photoId=${photo.id} durationMs=${Date.now() - startedAt} error=${message}`,
    );
  }
};

const start = async (): Promise<void> => {
  console.log(
    `[image-processor] started pollMs=${POLL_INTERVAL_MS} batchSize=${BATCH_SIZE} retryFailed=${RETRY_FAILED}`,
  );

  let running = true;

  const stop = async (signal: string) => {
    if (!running) {
      return;
    }
    running = false;
    console.log(`[image-processor] stopping signal=${signal}`);
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on("SIGINT", () => {
    void stop("SIGINT");
  });

  process.on("SIGTERM", () => {
    void stop("SIGTERM");
  });

  while (running) {
    try {
      const batch = await claimNextBatch();

      if (batch.length === 0) {
        await sleep(POLL_INTERVAL_MS);
        continue;
      }

      for (const photo of batch) {
        if (!running) {
          break;
        }
        await processPhoto(photo);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`[image-processor] loop error=${message}`);
      await sleep(POLL_INTERVAL_MS);
    }
  }
};

void start();
