import "../bootstrap";
import sharp from "sharp";
import type { Job } from "bull";
import prisma from "../../prisma";
import { enqueueAiAnalyzePhoto, photoQueue } from "../queues/photoQueue";
import { getS3ObjectBuffer, putS3Object } from "../utils/s3";

type MediaPrismaClient = typeof prisma & {
  photo: {
    findUnique: (
      args: unknown,
    ) => Promise<{ id: string; s3Key: string } | null>;
    update: (args: unknown) => Promise<unknown>;
  };
};

const mediaPrisma = prisma as MediaPrismaClient;

/**
 * Registers and starts the process-photo worker.
 */
const startProcessPhotoWorker = async (): Promise<void> => {
  photoQueue.process("process-photo", async (job: Job<{ photoId: string }>) => {
    const { photoId } = job.data;

    const photo = await mediaPrisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      throw new Error(`Photo not found: ${photoId}`);
    }

    await mediaPrisma.photo.update({
      where: { id: photoId },
      data: { status: "PROCESSING" },
    });

    try {
      const originalBuffer = await getS3ObjectBuffer(photo.s3Key);
      const metadata = await sharp(originalBuffer).metadata();

      const thumbnailKey = `thumbnails/${photo.id}.webp`;
      const previewKey = `previews/${photo.id}.webp`;

      const thumbnailBuffer = await sharp(originalBuffer)
        .resize({ width: 400, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const previewBuffer = await sharp(originalBuffer)
        .resize({ width: 1200, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();

      await Promise.all([
        putS3Object(thumbnailKey, thumbnailBuffer, "image/webp"),
        putS3Object(previewKey, previewBuffer, "image/webp"),
      ]);

      await mediaPrisma.photo.update({
        where: { id: photoId },
        data: {
          thumbnailKey,
          previewKey,
          width: metadata.width ?? null,
          height: metadata.height ?? null,
          status: "PROCESSED",
        },
      });

      await enqueueAiAnalyzePhoto(photoId);
    } catch (error) {
      await mediaPrisma.photo.update({
        where: { id: photoId },
        data: { status: "FAILED" },
      });
      throw error;
    }
  });

  photoQueue.on("failed", (job: Job | undefined, error: Error) => {
    const id = job?.data?.photoId ?? "unknown";
    console.error(`process-photo failed for ${id}:`, error.message);
  });

  console.log("process-photo worker started");
};

startProcessPhotoWorker().catch((error) => {
  console.error("Failed to start process-photo worker", error);
  process.exit(1);
});
