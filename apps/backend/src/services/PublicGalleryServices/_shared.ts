import { prisma } from "@workspace/db";

export const db = prisma as any;

export const publishedGalleryWhere = (token: string) => ({
  OR: [{ shareToken: token }, { slug: token }],
  isPublished: true,
});
