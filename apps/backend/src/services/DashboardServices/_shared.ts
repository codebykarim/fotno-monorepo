import { prisma } from "@workspace/db";

export const db = prisma as any;

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export const toIsoOrNull = (value: unknown): string | null => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
};

export const toDateOnly = (value: string | null): string | null => {
  if (!value) {
    return null;
  }
  return value.slice(0, 10);
};

export const buildStorageObjectUrl = (key: string): string => {
  const endpoint = (process.env.AWS_S3_ENDPOINT ?? process.env.R2_ENDPOINT ?? "").replace(/\/$/, "");
  const bucket = process.env.AWS_S3_BUCKET ?? "";
  const safeKey = key
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  if (endpoint && bucket) {
    return `${endpoint}/${bucket}/${safeKey}`;
  }

  return `/${safeKey}`;
};

export const mapPhoto = (photo: any) => ({
  id: photo.id,
  galleryId: photo.galleryId,
  url: buildStorageObjectUrl(photo.previewKey ?? photo.s3Key),
  order: photo.order,
  width: photo.width ?? 1200,
  height: photo.height ?? 1600,
  loved: Boolean(photo.loved),
  createdAt:
    photo.createdAt instanceof Date
      ? photo.createdAt.toISOString()
      : String(photo.createdAt),
});
