import prisma from "../../../prisma";

export const db = prisma as any;

export const publishedGalleryWhere = (token: string) => ({
  OR: [{ shareToken: token }, { slug: token }],
  isPublished: true,
});
