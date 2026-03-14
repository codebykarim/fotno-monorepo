import { db } from "./_shared";

export const gdriveImportStatus = async (
  userId: string,
  jobId: string,
) => {
  const job = await db.driveImportJob.findFirst({
    where: { id: jobId, userId },
    include: {
      items: {
        select: {
          id: true,
          galleryId: true,
          driveFolderName: true,
          driveFileName: true,
          driveFileSize: true,
          status: true,
          errorMessage: true,
        },
      },
    },
  });

  if (!job) {
    return { error: "Import job not found", status: 404 as const };
  }

  return {
    id: job.id,
    status: job.status,
    totalFiles: job.totalFiles,
    completedFiles: job.completedFiles,
    failedFiles: job.failedFiles,
    skippedFiles: job.skippedFiles,
    errorMessage: job.errorMessage,
    startedAt: job.startedAt?.toISOString() ?? null,
    completedAt: job.completedAt?.toISOString() ?? null,
    createdAt: job.createdAt.toISOString(),
    items: job.items.map((item: any) => ({
      id: item.id,
      galleryId: item.galleryId,
      folderName: item.driveFolderName,
      fileName: item.driveFileName,
      fileSize: item.driveFileSize.toString(),
      status: item.status,
      errorMessage: item.errorMessage,
    })),
  };
};

export const gdriveListImports = async (userId: string) => {
  const jobs = await db.driveImportJob.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      status: true,
      totalFiles: true,
      completedFiles: true,
      failedFiles: true,
      skippedFiles: true,
      createdAt: true,
      completedAt: true,
    },
  });

  return {
    imports: jobs.map((j: any) => ({
      id: j.id,
      status: j.status,
      totalFiles: j.totalFiles,
      completedFiles: j.completedFiles,
      failedFiles: j.failedFiles,
      skippedFiles: j.skippedFiles,
      createdAt: j.createdAt.toISOString(),
      completedAt: j.completedAt?.toISOString() ?? null,
    })),
  };
};
