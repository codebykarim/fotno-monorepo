import { db, slugify } from "./_shared";
import { getDriveAccessToken, hasDriveScope } from "./gdriveTokenManager";
import { uploadServiceRequest } from "./uploadServiceClient";

interface DriveFileInput {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
}

interface StartImportBody {
  files: DriveFileInput[];
  galleryId?: string;
  newGallery?: {
    title: string;
    eventDate?: string;
    clientEmail?: string;
    clientName?: string;
  };
}

export const gdriveStartImport = async (
  userId: string,
  body: StartImportBody,
) => {
  if (!body?.files?.length) {
    return { error: "At least one file is required", status: 400 as const };
  }

  if (!body.galleryId && !body.newGallery) {
    return { error: "galleryId or newGallery is required", status: 400 as const };
  }

  const hasScope = await hasDriveScope(userId);
  if (!hasScope) {
    return { error: "Google Drive not connected", status: 403 as const };
  }

  // Verify we can get an access token
  await getDriveAccessToken(userId);

  let galleryId = body.galleryId;

  if (!galleryId && body.newGallery) {
    const title = body.newGallery.title || "Google Drive Import";
    const slugBase = slugify(title);
    const slug = `${slugBase}-${Math.floor(Math.random() * 1000)}`;

    const gallery = await db.gallery.create({
      data: {
        userId,
        title,
        slug,
        eventDate: body.newGallery.eventDate
          ? new Date(body.newGallery.eventDate)
          : null,
        isPublished: false,
      },
    });

    if (body.newGallery.clientEmail) {
      const email = body.newGallery.clientEmail.toLowerCase().trim();
      const name =
        body.newGallery.clientName ||
        email.split("@")[0] ||
        "New Client";

      let client = await (db as any).client.findFirst({
        where: { userId, email },
      });

      if (!client) {
        client = await (db as any).client.create({
          data: { userId, email, name },
        });
      }

      await (db as any).galleryClient.upsert({
        where: {
          galleryId_clientId: {
            galleryId: gallery.id,
            clientId: client.id,
          },
        },
        update: {},
        create: { galleryId: gallery.id, clientId: client.id },
      });
    }

    galleryId = gallery.id;
  }

  if (!galleryId) {
    return { error: "Could not resolve gallery", status: 400 as const };
  }

  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { id: true },
  });

  if (!gallery) {
    return { error: `Gallery ${galleryId} not found`, status: 404 as const };
  }

  const job = await db.driveImportJob.create({
    data: { userId, source: "DRIVE", status: "PENDING", totalFiles: body.files.length },
  });

  await db.driveImportItem.createMany({
    data: body.files.map((file) => ({
      jobId: job.id,
      galleryId,
      driveFolderId: "picker",
      driveFolderName: "Google Drive Picker",
      driveFileId: file.id,
      driveFileName: file.name,
      driveFileSize: BigInt(file.sizeBytes || 0),
      driveMimeType: file.mimeType,
    })),
  });

  const uploadResult = await uploadServiceRequest<{ success: boolean }>(
    userId,
    "/api/import/gdrive-start",
    {
      method: "POST",
      body: JSON.stringify({ jobId: job.id }),
    },
  );

  if (!uploadResult.ok) {
    await db.driveImportJob.update({
      where: { id: job.id },
      data: {
        status: "FAILED",
        errorMessage: uploadResult.error,
      },
    });
    return { error: "Failed to start import worker", status: 500 as const };
  }

  return { jobId: job.id, totalFiles: body.files.length };
};
