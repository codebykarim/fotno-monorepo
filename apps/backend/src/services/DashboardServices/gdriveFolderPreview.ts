import { getDriveAccessToken } from "./gdriveTokenManager";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  thumbnailLink?: string;
}

export const gdriveFolderPreview = async (
  userId: string,
  folderId: string,
) => {
  const accessToken = await getDriveAccessToken(userId);

  const query = `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`;
  const params = new URLSearchParams({
    q: query,
    fields: "files(id,name,mimeType,size,thumbnailLink),nextPageToken",
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

    if (!res.ok) {
      const text = await res.text();
      return { error: `Drive API error: ${text}`, status: res.status as number };
    }

    const data = (await res.json()) as {
      files: DriveFile[];
      nextPageToken?: string;
    };

    allFiles = allFiles.concat(data.files);
    pageToken = data.nextPageToken;
  } while (pageToken);

  const totalSize = allFiles.reduce(
    (sum, f) => sum + (parseInt(f.size, 10) || 0),
    0,
  );

  // Google Drive thumbnailLinks require auth — append access_token so they work in <img>
  const sampleThumbnails = allFiles
    .slice(0, 4)
    .map((f) => {
      if (!f.thumbnailLink) return null;
      // Increase thumbnail size and append token
      const url = f.thumbnailLink.replace(/=s\d+$/, "=s400");
      return `${url}${url.includes("?") ? "&" : "?"}access_token=${accessToken}`;
    })
    .filter(Boolean) as string[];

  return {
    folderId,
    fileCount: allFiles.length,
    totalSize,
    sampleThumbnails,
    files: allFiles.map((f) => ({
      id: f.id,
      name: f.name,
      mimeType: f.mimeType,
      size: parseInt(f.size, 10) || 0,
    })),
  };
};
