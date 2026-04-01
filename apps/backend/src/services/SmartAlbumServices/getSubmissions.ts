import { db } from "./_shared";

interface GetSubmissionsOptions {
  status?: string;
  galleryId?: string;
  page?: number;
  pageSize?: number;
}

export const getSubmissions = async (userId: string, options: GetSubmissionsOptions = {}) => {
  try {
    const { status, galleryId, page = 1, pageSize = 20 } = options;
    const skip = (page - 1) * pageSize;

    const where: any = {
      design: {
        gallery: {
          userId,
          ...(galleryId ? { id: galleryId } : {}),
        },
      },
      ...(status ? { status } : {}),
    };

    const [submissions, total] = await db.$transaction([
      db.smartAlbumSubmission.findMany({
        where,
        select: {
          id: true,
          designId: true,
          version: true,
          status: true,
          submittedAt: true,
          designSnapshot: true,
          design: {
            select: {
              clientName: true,
              clientEmail: true,
              gallery: { select: { id: true, title: true } },
              product: { select: { name: true } },
            },
          },
          transaction: {
            select: { status: true, amountCents: true, netCents: true, currency: true },
          },
        },
        orderBy: { submittedAt: "desc" },
        skip,
        take: pageSize,
      }),
      db.smartAlbumSubmission.count({ where }),
    ]);

    const mapped = submissions.map((s: any) => {
      const snapshot = s.designSnapshot as any;
      const pageCount =
        1 + // cover
        (snapshot?.firstPage ? 1 : 0) +
        (snapshot?.spreads?.length || 0) +
        (snapshot?.lastPage ? 1 : 0);

      return {
        id: s.id,
        designId: s.designId,
        version: s.version,
        status: s.status,
        submittedAt: s.submittedAt,
        clientName: s.design.clientName,
        clientEmail: s.design.clientEmail,
        galleryTitle: s.design.gallery.title,
        productName: s.design.product.name,
        pageCount,
        paid: s.transaction?.status === "SUCCEEDED",
        paymentAmount: s.transaction ? {
          amountCents: s.transaction.amountCents,
          netCents: s.transaction.netCents,
          currency: s.transaction.currency,
        } : null,
      };
    });

    return { data: { submissions: mapped, total, page, pageSize } };
  } catch (err: any) {
    return { error: err.message, status: 500 as const };
  }
};
