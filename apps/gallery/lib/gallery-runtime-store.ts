export type ViewerRole = "client" | "photographer";

export type GalleryViewer = {
  id: string;
  name: string;
  role: ViewerRole;
  lastSeenAt: number;
};

type RuntimeStore = {
  viewersByGallery: Map<string, Map<string, GalleryViewer>>;
};

const getStore = (): RuntimeStore => {
  const globalStore = globalThis as typeof globalThis & {
    __fotnoGalleryStore?: RuntimeStore;
  };

  if (!globalStore.__fotnoGalleryStore) {
    globalStore.__fotnoGalleryStore = {
      viewersByGallery: new Map(),
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

/* ── Comment SSE pub/sub ── */

type CommentListener = (data: string) => void;

const getListeners = (): Map<string, Set<CommentListener>> => {
  const g = globalThis as typeof globalThis & {
    __fotnoCommentListeners?: Map<string, Set<CommentListener>>;
  };
  if (!g.__fotnoCommentListeners) {
    g.__fotnoCommentListeners = new Map();
  }
  return g.__fotnoCommentListeners;
};

export const subscribeComments = (
  shareToken: string,
  listener: CommentListener,
): (() => void) => {
  const map = getListeners();
  const set = map.get(shareToken) ?? new Set();
  set.add(listener);
  map.set(shareToken, set);

  return () => {
    set.delete(listener);
    if (set.size === 0) map.delete(shareToken);
  };
};

export const broadcastComments = (shareToken: string, data: string): void => {
  const set = getListeners().get(shareToken);
  if (!set) return;
  for (const listener of set) {
    listener(data);
  }
};
