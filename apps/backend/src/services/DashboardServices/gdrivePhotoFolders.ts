import { getDriveAccessToken } from "./gdriveTokenManager";

interface RawFolder {
  id: string;
  name: string;
  parents?: string[];
}

const DRIVE_API = "https://www.googleapis.com/drive/v3/files";

async function driveList<T>(
  accessToken: string,
  query: string,
  fields: string,
  pageSize = 1000,
): Promise<T[]> {
  const all: T[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      q: query,
      fields: `files(${fields}),nextPageToken`,
      pageSize: String(pageSize),
    });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(`${DRIVE_API}?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Drive API error (${res.status}): ${text}`);
    }

    const data = (await res.json()) as { files: T[]; nextPageToken?: string };
    all.push(...data.files);
    pageToken = data.nextPageToken;
  } while (pageToken);

  return all;
}

/** Count images directly inside a single folder (same query as preview). */
async function countFolderImages(
  accessToken: string,
  folderId: string,
): Promise<{ count: number; totalSize: number }> {
  const files = await driveList<{ size?: string }>(
    accessToken,
    `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
    "size",
  );
  let totalSize = 0;
  for (const f of files) {
    totalSize += parseInt(f.size ?? "0", 10) || 0;
  }
  return { count: files.length, totalSize };
}

/** Run async tasks with a concurrency limit. */
async function parallel<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const idx = next++;
      results[idx] = await fn(items[idx]!);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );
  return results;
}

function buildAncestors(
  folderId: string,
  folderMap: Map<string, RawFolder>,
): { id: string; name: string }[] {
  const ancestors: { id: string; name: string }[] = [];
  const folder = folderMap.get(folderId);
  if (!folder) return ancestors;

  let parentId = folder.parents?.[0];
  while (parentId && folderMap.has(parentId)) {
    const parent = folderMap.get(parentId)!;
    ancestors.unshift({ id: parent.id, name: parent.name });
    parentId = parent.parents?.[0];
  }

  return ancestors;
}

export const gdrivePhotoFolders = async (userId: string) => {
  let accessToken: string;
  try {
    accessToken = await getDriveAccessToken(userId);
  } catch {
    return { error: "Google Drive not connected", status: 401 as const };
  }

  let allFolders: RawFolder[];

  try {
    // List ALL folders to build the tree
    allFolders = await driveList<RawFolder>(
      accessToken,
      "mimeType = 'application/vnd.google-apps.folder' and trashed = false",
      "id,name,parents",
    );
  } catch (err: any) {
    const message = err?.message ?? "Failed to scan Google Drive";
    console.error("[gdrive-photo-folders]", message);
    return { error: message, status: 500 as const };
  }

  // Build folder lookup + identify which folders have child folders
  const folderMap = new Map<string, RawFolder>();
  const hasChildFolders = new Set<string>();

  for (const folder of allFolders) {
    folderMap.set(folder.id, folder);
    for (const parentId of folder.parents ?? []) {
      hasChildFolders.add(parentId);
    }
  }

  // Find leaf folders (no child folders)
  const leafFolders = allFolders.filter((f) => !hasChildFolders.has(f.id));

  // Query image count per leaf folder (concurrency 10, same query as preview)
  let stats: { count: number; totalSize: number }[];
  try {
    stats = await parallel(leafFolders, 10, (folder) =>
      countFolderImages(accessToken, folder.id),
    );
  } catch (err: any) {
    const message = err?.message ?? "Failed to count images";
    console.error("[gdrive-photo-folders]", message);
    return { error: message, status: 500 as const };
  }

  // Build result — only folders with at least 1 image
  const folders: {
    id: string;
    name: string;
    ancestors: { id: string; name: string }[];
    photoCount: number;
    totalSize: number;
  }[] = [];

  for (let i = 0; i < leafFolders.length; i++) {
    const leaf = leafFolders[i]!;
    const s = stats[i]!;
    if (s.count === 0) continue;

    folders.push({
      id: leaf.id,
      name: leaf.name,
      ancestors: buildAncestors(leaf.id, folderMap),
      photoCount: s.count,
      totalSize: s.totalSize,
    });
  }

  folders.sort((a, b) => {
    const pathA = [...a.ancestors.map((x) => x.name), a.name].join("/");
    const pathB = [...b.ancestors.map((x) => x.name), b.name].join("/");
    return pathA.localeCompare(pathB);
  });

  return { folders };
};
