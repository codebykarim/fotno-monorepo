import { publishedGalleryWhere, db } from "./_shared";

export const createSmartAlbumDesign = async (
  shareToken: string,
  body: {
    productId: string;
    clientName: string;
    clientEmail: string;
    title?: string;
  },
) => {
  // Verify gallery exists and is published
  const gallery = await db.gallery.findFirst({
    where: publishedGalleryWhere(shareToken),
    select: { id: true, userId: true },
  });

  if (!gallery) {
    return { error: "Gallery not found", status: 404 };
  }

  // Verify product exists and belongs to this gallery's photographer
  // Relation: SmartAlbumProduct → config (SmartAlbumConfig) → userId must match gallery.userId
  const product = await db.smartAlbumProduct.findFirst({
    where: {
      id: body.productId,
      isActive: true,
      config: {
        userId: gallery.userId,
        enabled: true,
      },
    },
  });

  if (!product) {
    return { error: "Product not found or not available for this gallery", status: 404 };
  }

  // Create design with empty scaffold
  const designData = {
    cover: { layoutId: "cover-full-bleed", slots: [] },
    firstPage: { layoutId: "single-centered", slots: [] },
    spreads: [],
    lastPage: { layoutId: "single-centered", slots: [] },
  };

  const design = await db.smartAlbumDesign.create({
    data: {
      galleryId: gallery.id,
      productId: body.productId,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      title: body.title || "Untitled Album",
      designData,
      status: "DRAFT",
    },
    select: {
      id: true,
      clientName: true,
      clientEmail: true,
      title: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return { design };
};
