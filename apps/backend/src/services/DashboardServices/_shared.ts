import prisma from "../../../prisma";

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

export const mapPhoto = (photo: any) => ({
  id: photo.id,
  galleryId: photo.galleryId,
  url: `https://picsum.photos/seed/${photo.id}/1200/1600`,
  order: photo.order,
  width: photo.width ?? 1200,
  height: photo.height ?? 1600,
  loved: Boolean(photo.loved),
  createdAt:
    photo.createdAt instanceof Date
      ? photo.createdAt.toISOString()
      : String(photo.createdAt),
});
