import { db, slugify } from "./_shared";
import { getPhotosAccessToken, hasPhotosScope } from "./gdriveTokenManager";
import { uploadServiceRequest } from "./uploadServiceClient";

const PICKER_API = "https://photospicker.googleapis.com/v1";

interface PickedMediaItem {
  id: string;
  type: "PHOTO" | "VIDEO";
  mediaFile: {
    baseUrl: string;
    mimeType: string;
    filename: string;
  };
}

async function listPickedMediaItems(
  accessToken: string,
  sessionId: string,
): Promise<PickedMediaItem[]> {
  const all: PickedMediaItem[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({ sessionId, pageSize: "100" });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(`${PICKER_API}/mediaItems?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) throw new Error(`Picker API error: ${res.status}`);

    const data = (await res.json()) as {
      mediaItems?: PickedMediaItem[];
      nextPageToken?: string;
    };

    all.push(...(data.mediaItems ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return all;
}

interface StartImportBody {
  sessionId: string;
  galleryId?: string;
  newGallery?: {
    title: string;
    eventDate?: string;
    clientEmail?: string;
    clientName?: string;
  };
}

export const gphotosStartImport = async (
  userId: string,
  body: StartImportBody,
) => {
  if (!body?.sessionId) {
    return { error: "sessionId is required", status: 400 as const };
  }

  const hasScope = await hasPhotosScope(userId);
  if (!hasScope) {
    return { error: "Google Photos not connected", status: 403 as const };
  }

  const accessToken = await getPhotosAccessToken(userId);

  // Resolve gallery
  let galleryId = body.galleryId;

  if (!galleryId && body.newGallery) {
    const title = body.newGallery.title || "Google Photos Import";
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
        body.newGallery.clientName || email.split("@")[0] || "New Client";

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
    return { error: "galleryId or newGallery is required", status: 400 as const };
  }

  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { id: true },
  });

  if (!gallery) {
    return { error: `Gallery ${galleryId} not found`, status: 404 as const };
  }

  // List picked items from the session
  const pickedItems = await listPickedMediaItems(accessToken, body.sessionId);

  // Filter to photos only
  const photos = pickedItems.filter((item) => item.type === "PHOTO");

  if (photos.length === 0) {
    return { error: "No photos were selected", status: 400 as const };
  }

  const job = await db.driveImportJob.create({
    data: { userId, source: "PHOTOS", status: "LISTING" },
  });

  await db.driveImportItem.createMany({
    data: photos.map((item) => ({
      jobId: job.id,
      galleryId,
      driveFolderId: body.sessionId,
      driveFolderName: "Google Photos",
      driveFileId: item.id,
      driveFileName: item.mediaFile.filename,
      driveFileSize: BigInt(0),
      driveMimeType: item.mediaFile.mimeType,
    })),
  });

  await db.driveImportJob.update({
    where: { id: job.id },
    data: { status: "PENDING", totalFiles: photos.length },
  });

  const uploadResult = await uploadServiceRequest<{ success: boolean }>(
    userId,
    "/api/import/gphotos-start",
    {
      method: "POST",
      body: JSON.stringify({ jobId: job.id }),
    },
  );

  if (!uploadResult.ok) {
    await db.driveImportJob.update({
      where: { id: job.id },
      data: { status: "FAILED", errorMessage: uploadResult.error },
    });
    return { error: "Failed to start import worker", status: 500 as const };
  }

  return { jobId: job.id, totalFiles: photos.length };
};
