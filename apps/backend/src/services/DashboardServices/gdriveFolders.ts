import { getDriveAccessToken } from "./gdriveTokenManager";

interface DriveFolder {
  id: string;
  name: string;
  modifiedTime: string;
}

export const gdriveFolders = async (
  userId: string,
  parentId?: string,
) => {
  const accessToken = await getDriveAccessToken(userId);
  const parent = parentId || "root";

  const query = `'${parent}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const params = new URLSearchParams({
    q: query,
    fields: "files(id,name,modifiedTime),nextPageToken",
    orderBy: "name",
    pageSize: "100",
  });

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  if (!res.ok) {
    const text = await res.text();
    return { error: `Drive API error: ${text}`, status: res.status as number };
  }

  const data = (await res.json()) as {
    files: DriveFolder[];
    nextPageToken?: string;
  };

  return {
    folders: data.files.map((f) => ({
      id: f.id,
      name: f.name,
      modifiedTime: f.modifiedTime,
    })),
  };
};
