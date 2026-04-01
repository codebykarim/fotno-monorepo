import { publishedGalleryWhere, db } from "./_shared";

export const listSmartAlbumDesigns = async (
  shareToken: string,
  clientEmail: string,
) => {
  // Verify gallery exists and is published
  const gallery = await db.gallery.findFirst({
    where: publishedGalleryWhere(shareToken),
    select: { id: true },
  });

  if (!gallery) {
    return { error: "Gallery not found", status: 404 };
  }

  // Get client's designs for this gallery
  const designs = await db.smartAlbumDesign.findMany({
    where: {
      galleryId: gallery.id,
      clientEmail: clientEmail,
    },
    select: {
      id: true,
      title: true,
      status: true,
      product: {
        select: {
          name: true,
          priceCents: true,
          currency: true,
        },
      },
      submissions: {
        select: {
          photographerNotes: true,
          status: true,
        },
        orderBy: { version: "desc" },
        take: 1,
      },
      createdAt: true,
      updatedAt: true,
    },
    orderBy: [{ createdAt: "desc" }],
  });

  // Flatten: expose photographerNotes at top level when CHANGES_REQUESTED
  const mapped = designs.map((d: any) => {
    const latestSubmission = d.submissions?.[0] ?? null;
    const { submissions: _submissions, ...rest } = d;
    return {
      ...rest,
      photographerNotes:
        d.status === "CHANGES_REQUESTED" ? (latestSubmission?.photographerNotes ?? null) : null,
    };
  });

  return { designs: mapped };
};
