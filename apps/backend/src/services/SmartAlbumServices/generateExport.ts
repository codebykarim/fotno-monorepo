import {
  LambdaClient,
  InvokeCommand,
} from "@aws-sdk/client-lambda";
import { db, extractPhotoIds } from "./_shared";
import { getPresignedDownloadUrl } from "../../utils/s3";

const lambda = new LambdaClient({ region: process.env.AWS_REGION });
const LAMBDA_FUNCTION_NAME =
  process.env.EXPORT_LAMBDA_FUNCTION_NAME ?? "fotno-album-export";

// ─── Main export ──────────────────────────────────────────────────────

export const generateExport = async (
  userId: string,
  submissionId: string,
  force = false,
) => {
  try {
    const submission = await db.smartAlbumSubmission.findFirst({
      where: { id: submissionId },
      include: {
        design: {
          select: {
            id: true,
            title: true,
            gallery: { select: { userId: true } },
            product: { select: { widthCm: true, heightCm: true, name: true } },
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

    if (submission.status !== "APPROVED") {
      return {
        error: "Only approved submissions can be exported",
        status: 400 as const,
      };
    }

    // Return existing export if already generated (unless force regenerate)
    if (!force && submission.exportReady && submission.exportUrl) {
      const signedUrl = await getPresignedDownloadUrl(
        submission.exportUrl,
        3600,
      );
      return {
        data: {
          exportUrl: signedUrl,
          expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
          fileName: `album-v${submission.version}.zip`,
        },
      };
    }

    const snapshot = submission.designSnapshot as any;
    const photoIds = extractPhotoIds(snapshot);

    const photos = await db.photo.findMany({
      where: { id: { in: photoIds } },
      select: { id: true, s3Key: true },
    });

    const { widthCm, heightCm } = submission.design.product;

    // Invoke Lambda to render all pages, zip, and upload to S3
    const response = await lambda.send(
      new InvokeCommand({
        FunctionName: LAMBDA_FUNCTION_NAME,
        InvocationType: "RequestResponse",
        Payload: Buffer.from(
          JSON.stringify({
            submissionId,
            version: submission.version,
            designSnapshot: snapshot,
            photos: photos.map((p: any) => ({ id: p.id, s3Key: p.s3Key })),
            widthCm,
            heightCm,
          }),
        ),
      }),
    );

    const payloadStr = new TextDecoder().decode(response.Payload);

    if (response.FunctionError) {
      let errorMessage = response.FunctionError;
      try {
        const errorPayload = JSON.parse(payloadStr);
        errorMessage =
          errorPayload.errorMessage ?? errorPayload.errorType ?? payloadStr;
      } catch {
        errorMessage = payloadStr || response.FunctionError;
      }
      throw new Error(`Export Lambda error: ${errorMessage}`);
    }

    const result: { s3Key: string } = JSON.parse(payloadStr);

    await db.smartAlbumSubmission.update({
      where: { id: submissionId },
      data: { exportReady: true, exportUrl: result.s3Key },
    });

    const signedUrl = await getPresignedDownloadUrl(result.s3Key, 3600);

    return {
      data: {
        exportUrl: signedUrl,
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
        fileName: `album-v${submission.version}.zip`,
      },
    };
  } catch (err: any) {
    return { error: err.message, status: 500 as const };
  }
};
