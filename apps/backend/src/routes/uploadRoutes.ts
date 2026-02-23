import { randomUUID } from "crypto";
import { Request, Response, Router } from "express";
import path from "path";
import { z } from "zod";
import AppError from "../errors/AppError";
import requireJwtPhotographer from "../middleware/requireJwtPhotographer";
import storageGuard from "../middleware/storage-guard";
import prisma from "../../prisma";
import { enqueuePhotoCleanup, enqueueProcessPhoto } from "../queues/photoQueue";
import { addStorage, removeStorage } from "../services/StorageServices";
import { getPresignedUploadUrl, s3Config } from "../utils/s3";

type MediaPrismaClient = typeof prisma & {
  gallery: {
    findFirst: (args: unknown) => Promise<{ id: string } | null>;
  };
  photo: {
    findFirst: (
      args: unknown,
    ) => Promise<{ order?: number; id: string; originalSize?: bigint } | null>;
    findUnique: (
      args: unknown,
    ) => Promise<
      | {
          id: string;
          s3Key: string;
          thumbnailKey?: string | null;
          previewKey?: string | null;
          totalSize?: bigint;
          gallery?: { userId: string };
        }
      | null
    >;
    create: (args: unknown) => Promise<{ id: string; s3Key: string }>;
    update: (args: unknown) => Promise<unknown>;
    delete: (args: unknown) => Promise<unknown>;
  };
};

const mediaPrisma = prisma as MediaPrismaClient;

type PresignRequestBody = {
  galleryId: string;
  filename: string;
  mimeType: string;
  size: number;
};

type PresignResponseBody = {
  presignedUrl: string;
  s3Key: string;
  photoId: string;
};

type ConfirmRequestBody = {
  photoId: string;
};

type ConfirmResponseBody = {
  photoId: string;
  status: "uploaded";
  queuedJob: "process-photo";
};

const presignSchema = z.object({
  galleryId: z.string().uuid(),
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(128),
  size: z.number().int().positive(),
});

const confirmSchema = z.object({
  photoId: z.string().uuid(),
});

const uploadRouter = Router();

/**
 * Creates a pending Photo record and returns a presigned S3 upload URL.
 */
uploadRouter.post(
  "/upload/presign",
  requireJwtPhotographer,
  storageGuard,
  async (
    req: Request<unknown, PresignResponseBody, PresignRequestBody>,
    res: Response,
  ) => {
    const body = presignSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    if (req.storageSummary?.freePlanBlocked) {
      return res.status(403).json({
        error: "STORAGE_LIMIT_EXCEEDED",
        upgradeUrl: "/billing",
      });
    }

    const gallery = await mediaPrisma.gallery.findFirst({
      where: {
        id: body.galleryId,
        userId,
      },
      select: { id: true },
    });

    if (!gallery) {
      throw new AppError("Gallery not found", 404);
    }

    const extFromFilename = path.extname(body.filename).replace(".", "");
    const extension = extFromFilename.length > 0 ? extFromFilename : "bin";
    const fileId = randomUUID();
    const s3Key = `uploads/${body.galleryId}/${fileId}.${extension}`;

    const latestPhoto = await mediaPrisma.photo.findFirst({
      where: { galleryId: body.galleryId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const photo = await mediaPrisma.photo.create({
      data: {
        galleryId: body.galleryId,
        s3Key,
        s3Bucket: s3Config.bucket,
        originalFilename: body.filename,
        originalSize: BigInt(body.size),
        totalSize: BigInt(body.size),
        mimeType: body.mimeType,
        aiTags: [],
        order: (latestPhoto?.order ?? -1) + 1,
        status: "pending",
      },
      select: {
        id: true,
        s3Key: true,
      },
    });

    const presignedUrl = await getPresignedUploadUrl(s3Key, body.mimeType, 300);

    return res.status(200).json({
      presignedUrl,
      s3Key: photo.s3Key,
      photoId: photo.id,
    });
  },
);

/**
 * Marks a photo as uploaded and enqueues processing.
 */
uploadRouter.post(
  "/upload/confirm",
  requireJwtPhotographer,
  async (
    req: Request<unknown, ConfirmResponseBody, ConfirmRequestBody>,
    res: Response<ConfirmResponseBody>,
  ) => {
    const body = confirmSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const photo = await mediaPrisma.photo.findFirst({
      where: {
        id: body.photoId,
        gallery: {
          userId,
        },
      },
      select: { id: true, originalSize: true },
    });

    if (!photo) {
      throw new AppError("Photo not found", 404);
    }

    await mediaPrisma.photo.update({
      where: { id: body.photoId },
      data: { status: "uploaded" },
    });

    await addStorage(
      userId,
      BigInt(photo.originalSize ?? 0),
      "upload",
      body.photoId,
    );

    void enqueueProcessPhoto(body.photoId).catch((error) => {
      console.error("Failed to enqueue process-photo job", error);
    });

    return res.status(200).json({
      photoId: body.photoId,
      status: "uploaded",
      queuedJob: "process-photo",
    });
  },
);

uploadRouter.delete(
  "/photos/:id",
  requireJwtPhotographer,
  async (req: Request<{ id: string }>, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const photo = await mediaPrisma.photo.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        s3Key: true,
        thumbnailKey: true,
        previewKey: true,
        totalSize: true,
        gallery: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!photo || photo.gallery?.userId !== userId) {
      throw new AppError("Photo not found", 404);
    }

    await removeStorage(
      userId,
      BigInt(photo.totalSize ?? 0),
      "delete",
      photo.id,
    );

    await mediaPrisma.photo.delete({
      where: { id: photo.id },
    });

    await enqueuePhotoCleanup([
      photo.s3Key,
      photo.thumbnailKey ?? "",
      photo.previewKey ?? "",
    ]);

    return res.status(200).json({ success: true, cleanupEnqueued: true });
  },
);

export default uploadRouter;
