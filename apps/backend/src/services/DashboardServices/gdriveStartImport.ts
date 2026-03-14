import { db, slugify } from "./_shared";
import { getDriveAccessToken, hasDriveScope } from "./gdriveTokenManager";
import { uploadServiceRequest } from "./uploadServiceClient";

interface FolderMapping {
  driveFolderId: string;
  driveFolderName: string;
  galleryId?: string;
  newGallery?: {
    title: string;
    eventDate?: string;
    clientEmail?: string;
    clientName?: string;
  };
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
}

async function listDriveImages(
  accessToken: string,
  folderId: string,
): Promise<DriveFile[]> {
  const query = `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`;
  const params = new URLSearchParams({
    q: query,
    fields: "files(id,name,mimeType,size),nextPageToken",
    pageSize: "1000",
  });

  let allFiles: DriveFile[] = [];
  let pageToken: string | undefined;

  do {
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!res.ok) throw new Error(`Drive API error: ${res.status}`);

    const data = (await res.json()) as {
      files: DriveFile[];
      nextPageToken?: string;
    };
    allFiles = allFiles.concat(data.files);
    pageToken = data.nextPageToken;
  } while (pageToken);

  return allFiles;
}

export const gdriveStartImport = async (
  userId: string,
  body: { mappings: FolderMapping[] },
) => {
  if (!body?.mappings?.length) {
    return { error: "At least one folder mapping is required", status: 400 as const };
  }

  const hasScope = await hasDriveScope(userId);
  if (!hasScope) {
    return { error: "Google Drive not connected", status: 403 as const };
  }

  const accessToken = await getDriveAccessToken(userId);

  const job = await db.driveImportJob.create({
    data: { userId, source: "DRIVE", status: "LISTING" },
  });

  const allItems: Array<{
    galleryId: string;
    driveFolderId: string;
    driveFolderName: string;
    driveFileId: string;
    driveFileName: string;
    driveFileSize: bigint;
    driveMimeType: string;
  }> = [];

  for (const mapping of body.mappings) {
    let galleryId = mapping.galleryId;

    if (!galleryId && mapping.newGallery) {
      const title = mapping.newGallery.title || mapping.driveFolderName;
      const slugBase = slugify(title);
      const slug = `${slugBase}-${Math.floor(Math.random() * 1000)}`;

      const gallery = await db.gallery.create({
        data: {
          userId,
          title,
          slug,
          eventDate: mapping.newGallery.eventDate
            ? new Date(mapping.newGallery.eventDate)
            : null,
          isPublished: false,
        },
      });

      if (mapping.newGallery.clientEmail) {
        const email = mapping.newGallery.clientEmail.toLowerCase().trim();
        const name =
          mapping.newGallery.clientName ||
          email.split("@")[0] ||
          "New Client";

        let client = await db.client.findFirst({
          where: { userId, email },
        });

        if (!client) {
          client = await db.client.create({
            data: { userId, email, name },
          });
        }

        await db.galleryClient.upsert({
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
      return { error: "Each mapping must have galleryId or newGallery", status: 400 as const };
    }

    const gallery = await db.gallery.findFirst({
      where: { id: galleryId, userId },
      select: { id: true },
    });

    if (!gallery) {
      return { error: `Gallery ${galleryId} not found`, status: 404 as const };
    }

    const files = await listDriveImages(accessToken, mapping.driveFolderId);

    for (const file of files) {
      allItems.push({
        galleryId,
        driveFolderId: mapping.driveFolderId,
        driveFolderName: mapping.driveFolderName,
        driveFileId: file.id,
        driveFileName: file.name,
        driveFileSize: BigInt(file.size || "0"),
        driveMimeType: file.mimeType,
      });
    }
  }

  if (allItems.length === 0) {
    await db.driveImportJob.update({
      where: { id: job.id },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
    return { jobId: job.id, totalFiles: 0 };
  }

  await db.driveImportItem.createMany({
    data: allItems.map((item) => ({
      jobId: job.id,
      ...item,
    })),
  });

  await db.driveImportJob.update({
    where: { id: job.id },
    data: {
      status: "PENDING",
      totalFiles: allItems.length,
    },
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

  return { jobId: job.id, totalFiles: allItems.length };
};
