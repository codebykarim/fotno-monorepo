import { db, extractPhotoIds } from "./_shared";
import { getPresignedDownloadUrl } from "../../utils/s3";

export const getSubmissionDetail = async (userId: string, submissionId: string) => {
  try {
    const submission = await db.smartAlbumSubmission.findFirst({
      where: { id: submissionId },
      include: {
        design: {
          select: {
            id: true,
            title: true,
            clientName: true,
            clientEmail: true,
            gallery: {
              select: { id: true, title: true, userId: true, shareToken: true },
            },
            product: { select: { id: true, name: true, widthCm: true, heightCm: true } },
          },
        },
        transaction: {
          select: {
            id: true,
            status: true,
            amountCents: true,
            feeCents: true,
            netCents: true,
            currency: true,
            paidAt: true,
          },
        },
      },
    });

    if (!submission) {
      return { error: "Submission not found", status: 404 as const };
    }

    if (submission.design.gallery.userId !== userId) {
      return { error: "Forbidden", status: 403 as const };
    }

    const snapshot = submission.designSnapshot as any;
    const photoIds = extractPhotoIds(snapshot);

    // Fetch photo keys and generate presigned preview URLs
    const photos = await db.photo.findMany({
      where: { id: { in: photoIds } },
      select: { id: true, s3Key: true, thumbnailKey: true, previewKey: true },
    });

    const photoUrls: Record<string, string> = {};
    await Promise.all(
      photos.map(async (photo: any) => {
        const key = photo.previewKey ?? photo.thumbnailKey ?? photo.s3Key;
        try {
          photoUrls[photo.id] = await getPresignedDownloadUrl(key, 3600);
        } catch {
          // Skip photos that fail to generate URLs
        }
      })
    );

    return {
      data: {
        id: submission.id,
        designId: submission.designId,
        version: submission.version,
        status: submission.status,
        clientName: submission.design.clientName,
        clientEmail: submission.design.clientEmail,
        galleryTitle: submission.design.gallery.title,
        shareToken: submission.design.gallery.shareToken,
        productName: submission.design.product.name,
        productId: submission.design.product.id,
        productWidthCm: submission.design.product.widthCm,
        productHeightCm: submission.design.product.heightCm,
        designSnapshot: snapshot,
        photographerNotes: submission.photographerNotes,
        reviewedAt: submission.reviewedAt,
        submittedAt: submission.submittedAt,
        exportUrl: submission.exportUrl,
        exportReady: submission.exportReady,
        transactionId: submission.transaction?.id,
        transactionStatus: submission.transaction?.status,
        transactionAmountCents: submission.transaction?.amountCents,
        transactionFeeCents: submission.transaction?.feeCents,
        transactionNetCents: submission.transaction?.netCents,
        transactionCurrency: submission.transaction?.currency,
        transactionPaidAt: submission.transaction?.paidAt,
        photoUrls,
      },
    };
  } catch (err: any) {
    return { error: err.message, status: 500 as const };
  }
};
