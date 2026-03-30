import "../../backend/src/bootstrap";
import { prisma } from "@workspace/db";
import {
  LambdaClient,
  InvokeCommand,
} from "@aws-sdk/client-lambda";

// ── Types ────────────────────────────────────────────────────────────

type ProcessingPhoto = {
  id: string;
  s3Key: string;
  galleryId: string;
  gallery: {
    userId: string;
  };
};

type LambdaResult = {
  thumbnailKey: string;
  previewKey: string;
  thumbnailSize: number;
  previewSize: number;
  width: number | null;
  height: number | null;
  originalSize: number;
  format: string;
};

// ── Configuration ────────────────────────────────────────────────────

const PREVIEW_MAX_BYTES = 1_000_000;
const THUMBNAIL_MAX_BYTES = 250_000;
const POLL_INTERVAL_MS = Number(process.env.IMAGE_PROCESSOR_POLL_MS ?? 3000);
// With Lambda handling heavy work, we can process more concurrently
const BATCH_SIZE = Number(process.env.IMAGE_PROCESSOR_BATCH_SIZE ?? 10);
const RETRY_FAILED = process.env.IMAGE_PROCESSOR_RETRY_FAILED === "true";
const PROCESSING_STALE_MS = Number(
  process.env.IMAGE_PROCESSOR_STALE_MS ?? 120_000,
);
const LAMBDA_FUNCTION_NAME =
  process.env.IMAGE_PROCESSOR_LAMBDA_NAME ?? "fotno-image-processor";

const sleep = async (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const lambda = new LambdaClient({ region: process.env.AWS_REGION });

// ── Storage Accounting ───────────────────────────────────────────────

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

// ── Batch Claiming ───────────────────────────────────────────────────

const claimNextBatch = async (): Promise<ProcessingPhoto[]> => {
  const now = Date.now();
  const staleBefore = new Date(now - PROCESSING_STALE_MS);

  const claimableStatuses = RETRY_FAILED
    ? ["uploaded", "failed"]
    : ["uploaded"];

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
          {
            status: { in: claimableStatuses },
            OR: [{ previewKey: null }, { thumbnailKey: null }],
          },
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

// ── Lambda Invocation ────────────────────────────────────────────────

const processPhoto = async (photo: ProcessingPhoto): Promise<void> => {
  const startedAt = Date.now();
  console.log(
    `[image-processor] invoking Lambda photoId=${photo.id} s3Key=${photo.s3Key}`,
  );

  try {
    const response = await lambda.send(
      new InvokeCommand({
        FunctionName: LAMBDA_FUNCTION_NAME,
        InvocationType: "RequestResponse",
        Payload: Buffer.from(
          JSON.stringify({
            s3Key: photo.s3Key,
            photoId: photo.id,
            thumbnailMaxBytes: THUMBNAIL_MAX_BYTES,
            previewMaxBytes: PREVIEW_MAX_BYTES,
          }),
        ),
      }),
    );

    const payloadStr = new TextDecoder().decode(response.Payload);

    if (response.FunctionError) {
      let errorMessage = response.FunctionError;
      try {
        const errorPayload = JSON.parse(payloadStr);
        errorMessage = errorPayload.errorMessage ?? errorPayload.errorType ?? payloadStr;
      } catch {
        errorMessage = payloadStr || response.FunctionError;
      }
      throw new Error(`Lambda error: ${errorMessage}`);
    }

    const result: LambdaResult = JSON.parse(payloadStr);

    // Update DB with Lambda results
    await (prisma as any).photo.update({
      where: { id: photo.id },
      data: {
        thumbnailKey: result.thumbnailKey,
        previewKey: result.previewKey,
        thumbnailSize: BigInt(result.thumbnailSize),
        previewSize: BigInt(result.previewSize),
        totalSize: BigInt(
          result.originalSize + result.thumbnailSize + result.previewSize,
        ),
        width: result.width,
        height: result.height,
        status: "processed",
      },
    });

    await addProcessingStorage(
      photo.gallery.userId,
      BigInt(result.thumbnailSize + result.previewSize),
      photo.id,
    );

    console.log(
      `[image-processor] completed photoId=${photo.id} format=${result.format} preview=${result.previewSize}B thumbnail=${result.thumbnailSize}B ${Date.now() - startedAt}ms`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const stack = error instanceof Error ? error.stack : undefined;
    console.error(
      `[image-processor] failed photoId=${photo.id} s3Key=${photo.s3Key} ${Date.now() - startedAt}ms error=${message}`,
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
  }
};

// ── Main Loop ────────────────────────────────────────────────────────

const start = async (): Promise<void> => {
  console.log(
    `[image-processor] started (Lambda mode) pollMs=${POLL_INTERVAL_MS} batchSize=${BATCH_SIZE} retryFailed=${RETRY_FAILED} lambda=${LAMBDA_FUNCTION_NAME}`,
  );

  let running = true;
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
    if (!running) return;
    running = false;
    console.log(`[image-processor] stopping signal=${signal}`);
    await markActiveAsFailed();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on("SIGINT", () => void stop("SIGINT"));
  process.on("SIGTERM", () => void stop("SIGTERM"));

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

      // Process entire batch concurrently — Lambda handles isolation,
      // our server just waits for responses (near-zero CPU/RAM)
      const results = await Promise.allSettled(
        batch.map((photo) => processPhoto(photo)),
      );

      // Log summary
      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;
      if (failed > 0) {
        console.log(
          `[image-processor] batch done: ${succeeded} succeeded, ${failed} failed`,
        );
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
