import { publishedGalleryWhere, db } from "./_shared";

export const getSmartAlbumDesign = async (
  shareToken: string,
  designId: string,
) => {
  // Verify gallery exists and is published
  const gallery = await db.gallery.findFirst({
    where: publishedGalleryWhere(shareToken),
    select: { id: true },
  });

  if (!gallery) {
    return { error: "Gallery not found", status: 404 };
  }

  // Get design with full data
  const design = await db.smartAlbumDesign.findFirst({
    where: {
      id: designId,
      galleryId: gallery.id,
    },
    select: {
      id: true,
      clientName: true,
      clientEmail: true,
      title: true,
      status: true,
      designData: true,
      productId: true,
      product: {
        select: {
          id: true,
          name: true,
          size: true,
          coverType: true,
          paperType: true,
          maxPages: true,
          priceCents: true,
          currency: true,
        },
      },
      submissions: {
        select: { photographerNotes: true },
        orderBy: { version: "desc" },
        take: 1,
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!design) {
    return { error: "Design not found", status: 404 };
  }

  // Flatten: expose photographerNotes at top level for CHANGES_REQUESTED
  const latestSubmission = design.submissions?.[0] ?? null;
  const { submissions: _submissions, ...rest } = design;
  return {
    design: {
      ...rest,
      photographerNotes:
        design.status === "CHANGES_REQUESTED"
          ? (latestSubmission?.photographerNotes ?? null)
          : null,
    },
  };
};
