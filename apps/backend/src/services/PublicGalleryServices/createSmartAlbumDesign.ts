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

  // Build design scaffold based on product configuration
  const designData: Record<string, any> = {
    spreads: [],
  };

  // Add cover if product has it
  if (product.hasCover) {
    designData.cover = { layoutId: "cover-full-bleed", slots: [] };
  } else {
    designData.cover = null;
  }

  // Add first page if product has it
  if (product.hasFirstPage) {
    designData.firstPage = { layoutId: "single-centered", slots: [] };
  } else {
    designData.firstPage = null;
  }

  // Add last page if product has it
  if (product.hasLastPage) {
    designData.lastPage = { layoutId: "single-centered", slots: [] };
  } else {
    designData.lastPage = null;
  }

  // Auto-add all max spreads so user doesn't have to add one by one
  const defaultSpreadLayoutId = "spread-full-bleed";
  for (let i = 0; i < product.maxSpreads; i++) {
    designData.spreads.push({
      order: i,
      layoutId: defaultSpreadLayoutId,
      slots: [],
    });
  }

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
