export type ViewerRole = "client" | "photographer";

export type GalleryViewer = {
  id: string;
  name: string;
  role: ViewerRole;
  lastSeenAt: number;
};

export type GalleryComment = {
  id: string;
  shareToken: string;
  authorName: string;
  message: string;
  photoId: string | null;
  createdAt: string;
};

type RuntimeStore = {
  viewersByGallery: Map<string, Map<string, GalleryViewer>>;
  commentsByGallery: Map<string, GalleryComment[]>;
};

const getStore = (): RuntimeStore => {
  const globalStore = globalThis as typeof globalThis & {
    __fotnoGalleryStore?: RuntimeStore;
  };

  if (!globalStore.__fotnoGalleryStore) {
    globalStore.__fotnoGalleryStore = {
      viewersByGallery: new Map(),
      commentsByGallery: new Map(),
    };
  }

  return globalStore.__fotnoGalleryStore;
};

const VIEWER_TTL_MS = 45_000;

const cleanupViewers = (shareToken: string, now = Date.now()) => {
  const store = getStore();
  const viewers = store.viewersByGallery.get(shareToken);
  if (!viewers) {
    return;
  }

  for (const [viewerId, viewer] of viewers.entries()) {
    if (now - viewer.lastSeenAt > VIEWER_TTL_MS) {
      viewers.delete(viewerId);
    }
  }

  if (viewers.size === 0) {
    store.viewersByGallery.delete(shareToken);
  }
};

export const upsertViewer = (params: {
  shareToken: string;
  viewerId: string;
  name: string;
  role: ViewerRole;
}) => {
  const store = getStore();
  const now = Date.now();
  cleanupViewers(params.shareToken, now);

  const galleryViewers =
    store.viewersByGallery.get(params.shareToken) ?? new Map<string, GalleryViewer>();
  galleryViewers.set(params.viewerId, {
    id: params.viewerId,
    name: params.name,
    role: params.role,
    lastSeenAt: now,
  });
  store.viewersByGallery.set(params.shareToken, galleryViewers);

  return Array.from(galleryViewers.values()).sort(
    (a, b) => b.lastSeenAt - a.lastSeenAt,
  );
};

export const removeViewer = (shareToken: string, viewerId: string) => {
  const store = getStore();
  const viewers = store.viewersByGallery.get(shareToken);
  if (!viewers) {
    return [];
  }

  viewers.delete(viewerId);
  cleanupViewers(shareToken);
  return Array.from(viewers.values()).sort((a, b) => b.lastSeenAt - a.lastSeenAt);
};

export const getActiveViewers = (shareToken: string): GalleryViewer[] => {
  cleanupViewers(shareToken);
  const store = getStore();
  const viewers = store.viewersByGallery.get(shareToken);
  return viewers
    ? Array.from(viewers.values()).sort((a, b) => b.lastSeenAt - a.lastSeenAt)
    : [];
};

export const addComment = (comment: GalleryComment): GalleryComment[] => {
  const store = getStore();
  const comments = store.commentsByGallery.get(comment.shareToken) ?? [];
  const updated = [comment, ...comments].slice(0, 200);
  store.commentsByGallery.set(comment.shareToken, updated);
  return updated;
};

export const listComments = (shareToken: string): GalleryComment[] => {
  const store = getStore();
  return store.commentsByGallery.get(shareToken) ?? [];
};
