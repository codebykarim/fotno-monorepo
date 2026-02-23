import "../bootstrap";
import sharp from "sharp";
import type { Job } from "bull";
import prisma from "../../prisma";
import {
  cleanupQueue,
  enqueueAiAnalyzePhoto,
  photoQueue,
} from "../queues/photoQueue";
import { addStorage } from "../services/StorageServices";
import { deleteS3Object, getS3ObjectBuffer, putS3Object } from "../utils/s3";

type MediaPrismaClient = typeof prisma & {
  photo: {
    findUnique: (
      args: unknown,
    ) => Promise<
      | {
          id: string;
          s3Key: string;
          gallery: { userId: string };
        }
      | null
    >;
    update: (args: unknown) => Promise<unknown>;
  };
};

const mediaPrisma = prisma as MediaPrismaClient;

const PREVIEW_MAX_BYTES = 1_000_000;
const THUMBNAIL_MAX_BYTES = 250_000;

type CompressionOptions = {
  targetWidth: number;
  minWidth: number;
  maxBytes: number;
  initialQuality: number;
  minQuality: number;
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

/**
 * Registers and starts the process-photo worker.
 */
export const startProcessPhotoWorker = async (): Promise<void> => {
  photoQueue.process("process-photo", async (job: Job<{ photoId: string }>) => {
    const { photoId } = job.data;
    const startedAt = Date.now();
    console.log(`[process-photo] started photoId=${photoId}`);

    const photo = await mediaPrisma.photo.findUnique({
      where: { id: photoId },
      select: {
        id: true,
        s3Key: true,
        gallery: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!photo) {
      throw new Error(`Photo not found: ${photoId}`);
    }

    await mediaPrisma.photo.update({
      where: { id: photoId },
      data: { status: "processing" },
    });

    try {
      const originalBuffer = await getS3ObjectBuffer(photo.s3Key);
      const metadata = await sharp(originalBuffer).metadata();

      const thumbnailKey = `thumbnails/${photo.id}.webp`;
      const previewKey = `previews/${photo.id}.webp`;

      const originalWidth = metadata.width ?? 2400;
      const previewTargetWidth = Math.min(2400, Math.max(1600, originalWidth));
      const thumbnailTargetWidth = Math.min(700, Math.max(480, Math.floor(originalWidth / 3)));

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
        putS3Object(thumbnailKey, thumbnailBuffer, "image/webp"),
        putS3Object(previewKey, previewBuffer, "image/webp"),
      ]);

      await mediaPrisma.photo.update({
        where: { id: photoId },
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

      await addStorage(
        photo.gallery.userId,
        BigInt(thumbnailBuffer.length + previewBuffer.length),
        "processing",
        photo.id,
      );

      await enqueueAiAnalyzePhoto(photoId);
      console.log(
        `[process-photo] completed photoId=${photoId} previewBytes=${previewBuffer.length} thumbnailBytes=${thumbnailBuffer.length} durationMs=${Date.now() - startedAt}`,
      );
    } catch (error) {
      await mediaPrisma.photo.update({
        where: { id: photoId },
        data: { status: "failed" },
      });
      console.error(
        `[process-photo] failed photoId=${photoId} durationMs=${Date.now() - startedAt}`,
      );
      throw error;
    }
  });

  photoQueue.on("failed", (job: Job | undefined, error: Error) => {
    const id = job?.data?.photoId ?? "unknown";
    console.error(`process-photo failed for ${id}:`, error.message);
  });

  cleanupQueue.process(
    "cleanup-photo-assets",
    async (job: Job<{ keys: string[] }>) => {
      const keys = Array.from(
        new Set((job.data.keys ?? []).filter((key) => key.trim().length > 0)),
      );

      if (keys.length === 0) {
        return;
      }

      const deletionResults = await Promise.allSettled(
        keys.map(async (key) => {
          await deleteS3Object(key);
          return key;
        }),
      );

      const failedKeys = deletionResults
        .map((result, index) => ({ result, key: keys[index] }))
        .filter(
          (
            item,
          ): item is {
            result: PromiseRejectedResult;
            key: string;
          } => item.result.status === "rejected",
        )
        .map((item) => item.key);

      if (failedKeys.length > 0) {
        throw new Error(
          `Failed to delete ${failedKeys.length} S3/R2 object(s): ${failedKeys.join(", ")}`,
        );
      }

      console.log(`[cleanup-photo-assets] deleted ${keys.length} object(s)`);
    },
  );

  cleanupQueue.on("failed", (job: Job | undefined, error: Error) => {
    const keyCount = Array.isArray(job?.data?.keys) ? job.data.keys.length : 0;
    console.error(
      `cleanup-photo-assets failed for ${keyCount} key(s):`,
      error.message,
    );
  });

  console.log("process-photo worker started");
};

if (require.main === module) {
  startProcessPhotoWorker().catch((error) => {
    console.error("Failed to start process-photo worker", error);
    process.exit(1);
  });
}
