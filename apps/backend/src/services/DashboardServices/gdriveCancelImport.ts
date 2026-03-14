import { db } from "./_shared";

export const gdriveCancelImport = async (
  userId: string,
  jobId: string,
) => {
  const job = await db.driveImportJob.findFirst({
    where: { id: jobId, userId },
    select: { id: true, status: true },
  });

  if (!job) {
    return { error: "Import job not found", status: 404 as const };
  }

  if (job.status === "COMPLETED" || job.status === "CANCELLED") {
    return { error: `Cannot cancel job with status ${job.status}`, status: 400 as const };
  }

  await db.driveImportJob.update({
    where: { id: job.id },
    data: { status: "CANCELLED" },
  });

  return { success: true };
};
