import { db } from "./_shared";
import { sendAlbumNotification } from "./sendAlbumNotification";

interface ReviewOptions {
  action: "approve" | "request_changes" | "reject";
  notes?: string;
  reason?: string;
}

export const reviewSubmission = async (
  userId: string,
  submissionId: string,
  options: ReviewOptions,
) => {
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

    if (submission.status !== "PENDING") {
      return {
        error: `Cannot review submission with status ${submission.status}. Only PENDING submissions can be reviewed.`,
        status: 400 as const,
      };
    }

    const { action, notes, reason } = options;
    const resolvedNotes = notes || reason;

    if (action === "request_changes" && !resolvedNotes) {
      return { error: "Notes are required when requesting changes", status: 400 as const };
    }

    if (action === "reject" && !resolvedNotes) {
      return { error: "Reason is required when rejecting", status: 400 as const };
    }

    let submissionStatus: string;
    let designStatus: string;

    switch (action) {
      case "approve":
        submissionStatus = "APPROVED";
        designStatus = "APPROVED";
        break;
      case "request_changes":
        submissionStatus = "CHANGES_REQUESTED";
        designStatus = "CHANGES_REQUESTED";
        break;
      case "reject":
        submissionStatus = "REJECTED";
        designStatus = "REJECTED";
        break;
    }

    const [updatedSubmission] = await db.$transaction([
      db.smartAlbumSubmission.update({
        where: { id: submissionId },
        data: {
          status: submissionStatus as any,
          photographerNotes: resolvedNotes ?? null,
          reviewedAt: new Date(),
        },
      }),
      db.smartAlbumDesign.update({
        where: { id: submission.designId },
        data: { status: designStatus as any },
      }),
    ]);

    const galleryUrl = process.env.GALLERY_URL || "https://gallery.fotno.com";
    const designUrl = `${galleryUrl}/${submission.design.gallery.shareToken}/album/${submission.designId}`;

    if (action === "approve") {
      sendAlbumNotification({
        type: "approved",
        clientEmail: submission.design.clientEmail,
        clientName: submission.design.clientName,
        albumTitle: submission.design.title,
        galleryTitle: submission.design.gallery.title,
        notes: resolvedNotes,
      }).catch((err: Error) => console.error("Failed to send approval email:", err));
    } else if (action === "request_changes") {
      sendAlbumNotification({
        type: "changes_requested",
        clientEmail: submission.design.clientEmail,
        clientName: submission.design.clientName,
        albumTitle: submission.design.title,
        galleryTitle: submission.design.gallery.title,
        notes: resolvedNotes!,
        designUrl,
      }).catch((err: Error) => console.error("Failed to send changes_requested email:", err));
    } else if (action === "reject") {
      sendAlbumNotification({
        type: "rejected",
        clientEmail: submission.design.clientEmail,
        clientName: submission.design.clientName,
        albumTitle: submission.design.title,
        galleryTitle: submission.design.gallery.title,
        reason: resolvedNotes!,
      }).catch((err: Error) => console.error("Failed to send rejection email:", err));
    }

    return { data: updatedSubmission };
  } catch (err: any) {
    return { error: err.message, status: 500 as const };
  }
};
