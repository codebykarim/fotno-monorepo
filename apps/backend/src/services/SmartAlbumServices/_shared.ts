import { prisma } from "@workspace/db";

export const db = prisma;

export const buildStorageObjectUrl = (key: string): string => {
  const cfDomain = process.env.CLOUDFRONT_DOMAIN;
  const safeKey = key
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  if (cfDomain) {
    return `https://${cfDomain}/${safeKey}`;
  }

  return `/${safeKey}`;
};

/**
 * Extracts all unique photoIds from a design snapshot's slots
 * (cover, firstPage, spreads, lastPage).
 */
export function extractPhotoIds(snapshot: any): string[] {
  const ids = new Set<string>();

  const addFromSlots = (slots: any[]) => {
    for (const slot of slots || []) {
      if (slot.photoId) ids.add(slot.photoId);
    }
  };

  addFromSlots(snapshot?.cover?.slots);
  addFromSlots(snapshot?.firstPage?.slots);
  addFromSlots(snapshot?.lastPage?.slots);
  for (const spread of snapshot?.spreads || []) {
    addFromSlots(spread.slots);
  }

  return Array.from(ids);
}
