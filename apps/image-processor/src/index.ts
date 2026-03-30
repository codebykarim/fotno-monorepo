import "../../backend/src/bootstrap";
import sharp from "sharp";
import { prisma } from "@workspace/db";
import { multipartService } from "../../upload-service/src/services/multipart";

// Disable sharp cache to reduce memory usage with many unique images
sharp.cache(false);
// Limit libvips thread pool — prevents saturating all shared CPU cores
// Default of 0 uses all cores; 1-2 is ideal for shared / low-core servers
sharp.concurrency(Number(process.env.IMAGE_PROCESSOR_SHARP_CONCURRENCY ?? 1));

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
  gallery: {
    userId: string;
  };
};

const PREVIEW_MAX_BYTES = 1_000_000;
const THUMBNAIL_MAX_BYTES = 250_000;
const POLL_INTERVAL_MS = Number(process.env.IMAGE_PROCESSOR_POLL_MS ?? 3000);
const BATCH_SIZE = Number(process.env.IMAGE_PROCESSOR_BATCH_SIZE ?? 2);
const RETRY_FAILED = process.env.IMAGE_PROCESSOR_RETRY_FAILED === "true";
const PROCESSING_STALE_MS = Number(
  process.env.IMAGE_PROCESSOR_STALE_MS ?? 120_000,
);
// Per-photo timeout (default 60 seconds) — prevents hung sharp operations
const PHOTO_TIMEOUT_MS = Number(
  process.env.IMAGE_PROCESSOR_PHOTO_TIMEOUT_MS ?? 60_000,
);

const sleep = async (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const withTimeout = <T>(promise: Promise<T>, ms: number, label: string): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Timeout after ${ms}ms: ${label}`)),
      ms,
    );
    promise.then(
      (val) => { clearTimeout(timer); resolve(val); },
      (err) => { clearTimeout(timer); reject(err); },
    );
  });

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

  // Step 1: Resize to target width once — avoids re-decoding the full original
  // (a 15MB JPEG at 6000x4000 = ~72MB decoded; resized to 2400w ≈ ~11MB decoded)
  let resized = await sharp(sourceBuffer, { failOnError: false })
    .resize({ width, fit: "inside", withoutEnlargement: true })
    .toBuffer();

  for (let attempt = 0; attempt < 12; attempt += 1) {
    // Encode the already-resized buffer — much cheaper than re-decoding original
    const candidate = await sharp(resized, { failOnError: false })
      .webp({ quality, effort: 4 })
      .toBuffer();

    if (candidate.length <= options.maxBytes) {
      return candidate;
    }

    // Try reducing quality first (larger steps for fewer iterations)
    if (quality > options.minQuality) {
      quality = Math.max(options.minQuality, quality - 8);
      continue;
    }

    // Quality exhausted at this width — downscale from the original
    const nextWidth = Math.floor(width * 0.85);
    if (nextWidth < options.minWidth) {
      break;
    }

    width = nextWidth;
    quality = options.initialQuality;
    resized = await sharp(sourceBuffer, { failOnError: false })
      .resize({ width, fit: "inside", withoutEnlargement: true })
      .toBuffer();
  }

  // Final attempt at minimum quality + current width
  const fallback = await sharp(resized, { failOnError: false })
    .webp({ quality: options.minQuality, effort: 4 })
    .toBuffer();

  if (fallback.length > options.maxBytes) {
    throw new Error(`Unable to compress image under ${options.maxBytes} bytes`);
  }

  return fallback;
};

const claimNextBatch = async (): Promise<ProcessingPhoto[]> => {
  const now = Date.now();
  const staleBefore = new Date(now - PROCESSING_STALE_MS);

  const claimableStatuses = RETRY_FAILED
    ? ["uploaded", "failed"]
    : ["uploaded"];

  // Fresh uploads: need processing (missing preview/thumbnail)
  // Stale "processing": something went wrong, reclaim regardless of key state
  const candidates = await (prisma as any).photo.findMany({
    where: {
      OR: [
        {
          status: { in: claimableStatuses },
          OR: [{ previewKey: null }, { thumbnailKey: null }],
        },
        {
          status: "processing",
          createdAt: { lt: staleBefore },
        },
      ],
    },
    orderBy: { createdAt: "asc" },
    take: BATCH_SIZE,
    select: {
      id: true,
      s3Key: true,
      galleryId: true,
      gallery: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (candidates.length > 0) {
    console.log(
      `[image-processor] found ${candidates.length} candidate(s) to process`,
    );
  }

  const claimed: ProcessingPhoto[] = [];

  for (const candidate of candidates) {
    const updated = await (prisma as any).photo.updateMany({
      where: {
        id: candidate.id,
        OR: [
          { status: { in: claimableStatuses }, OR: [{ previewKey: null }, { thumbnailKey: null }] },
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

// Maximum input pixels (100 megapixels) — prevents OOM on absurdly large images
const MAX_INPUT_PIXELS = Number(
  process.env.IMAGE_PROCESSOR_MAX_PIXELS ?? 100_000_000,
);

const processPhoto = async (photo: ProcessingPhoto): Promise<void> => {
  const startedAt = Date.now();
  console.log(`[image-processor] started photoId=${photo.id} s3Key=${photo.s3Key}`);

  let originalBuffer: Buffer | null = null;

  try {
    originalBuffer = await withTimeout(
      multipartService.downloadToBuffer(photo.s3Key),
      PHOTO_TIMEOUT_MS,
      `download ${photo.id}`,
    );

    console.log(
      `[image-processor] downloaded photoId=${photo.id} sizeBytes=${originalBuffer.length}`,
    );

    // Validate the image is readable before doing heavy work
    const metadata = await withTimeout(
      sharp(originalBuffer, { failOnError: true, limitInputPixels: MAX_INPUT_PIXELS }).metadata(),
      15_000,
      `metadata ${photo.id}`,
    );

    if (!metadata.format) {
      throw new Error("Unrecognizable image format");
    }

    const pixels = (metadata.width ?? 0) * (metadata.height ?? 0);
    if (pixels > MAX_INPUT_PIXELS) {
      throw new Error(
        `Image too large: ${metadata.width}x${metadata.height} = ${pixels} pixels (max ${MAX_INPUT_PIXELS})`,
      );
    }

    console.log(
      `[image-processor] metadata photoId=${photo.id} format=${metadata.format} dimensions=${metadata.width}x${metadata.height}`,
    );

    const thumbnailKey = `thumbnails/${photo.id}.webp`;
    const previewKey = `previews/${photo.id}.webp`;

    const originalWidth = metadata.width ?? 2400;
    const previewTargetWidth = Math.min(2400, Math.max(1600, originalWidth));
    const thumbnailTargetWidth = Math.min(
      700,
      Math.max(480, Math.floor(originalWidth / 3)),
    );

    // Process sequentially to keep memory predictable
    const thumbnailBuffer = await withTimeout(
      compressWebpUnderBudget(originalBuffer, {
        targetWidth: thumbnailTargetWidth,
        minWidth: 320,
        maxBytes: THUMBNAIL_MAX_BYTES,
        initialQuality: 84,
        minQuality: 50,
      }),
      PHOTO_TIMEOUT_MS,
      `thumbnail ${photo.id}`,
    );

    const previewBuffer = await withTimeout(
      compressWebpUnderBudget(originalBuffer, {
        targetWidth: previewTargetWidth,
        minWidth: 960,
        maxBytes: PREVIEW_MAX_BYTES,
        initialQuality: 86,
        minQuality: 54,
      }),
      PHOTO_TIMEOUT_MS,
      `preview ${photo.id}`,
    );

    // Free original buffer before uploads — no longer needed
    const originalSize = originalBuffer.length;
    originalBuffer = null;

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
          originalSize + thumbnailBuffer.length + previewBuffer.length,
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

    console.log(
      `[image-processor] completed photoId=${photo.id} previewBytes=${previewBuffer.length} thumbnailBytes=${thumbnailBuffer.length} durationMs=${Date.now() - startedAt}`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const stack = error instanceof Error ? error.stack : undefined;
    console.error(
      `[image-processor] failed photoId=${photo.id} s3Key=${photo.s3Key} durationMs=${Date.now() - startedAt} error=${message}`,
    );
    if (stack) {
      console.error(`[image-processor] stack: ${stack}`);
    }

    try {
      await (prisma as any).photo.update({
        where: { id: photo.id },
        data: { status: "failed" },
      });
    } catch (dbError) {
      console.error(
        `[image-processor] failed to mark photo as failed photoId=${photo.id}`,
      );
    }
  } finally {
    // Ensure buffer is released even on unexpected paths
    originalBuffer = null;
  }
};

const start = async (): Promise<void> => {
  console.log(
    `[image-processor] started pollMs=${POLL_INTERVAL_MS} batchSize=${BATCH_SIZE} retryFailed=${RETRY_FAILED}`,
  );

  let running = true;
  // Track currently processing photo IDs so we can mark them failed on crash
  let activePhotoIds: string[] = [];

  const markActiveAsFailed = async () => {
    if (activePhotoIds.length === 0) return;
    try {
      await (prisma as any).photo.updateMany({
        where: { id: { in: activePhotoIds } },
        data: { status: "failed" },
      });
      console.log(
        `[image-processor] marked ${activePhotoIds.length} active photos as failed on shutdown`,
      );
    } catch {
      // DB might be unreachable during crash
    }
  };

  const stop = async (signal: string) => {
    if (!running) {
      return;
    }
    running = false;
    console.log(`[image-processor] stopping signal=${signal}`);
    await markActiveAsFailed();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on("SIGINT", () => {
    void stop("SIGINT");
  });

  process.on("SIGTERM", () => {
    void stop("SIGTERM");
  });

  // Catch unhandled errors — mark active photos as failed so they don't stay stuck
  process.on("uncaughtException", async (err) => {
    console.error(`[image-processor] uncaughtException: ${err.message}`);
    await markActiveAsFailed();
    await prisma.$disconnect();
    process.exit(1);
  });

  process.on("unhandledRejection", (reason) => {
    console.error(
      `[image-processor] unhandledRejection: ${reason instanceof Error ? reason.message : reason}`,
    );
  });

  while (running) {
    try {
      const batch = await claimNextBatch();

      if (batch.length === 0) {
        await sleep(POLL_INTERVAL_MS);
        continue;
      }

      activePhotoIds = batch.map((p) => p.id);

      for (const photo of batch) {
        if (!running) {
          break;
        }
        await processPhoto(photo);
        // Remove from active list after completion (success or caught failure)
        activePhotoIds = activePhotoIds.filter((id) => id !== photo.id);
      }

      activePhotoIds = [];
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`[image-processor] loop error=${message}`);
      activePhotoIds = [];
      await sleep(POLL_INTERVAL_MS);
    }
  }
};

void start();
