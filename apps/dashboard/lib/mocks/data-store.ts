import { Activity, Album, Gallery, Photo, UploadTicket } from "@/lib/types/gallery";

type Store = {
  galleries: Gallery[];
  photos: Photo[];
  albums: Album[];
  activity: Activity[];
  uploadTickets: UploadTicket[];
};

declare global {
  // eslint-disable-next-line no-var
  var __fotnoDashboardStore: Store | undefined;
}

const now = Date.now();

const seedPhotos: Photo[] = [
  {
    id: "p1",
    galleryId: "g1",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=60",
    previewUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=75",
    originalUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=90",
    order: 1,
    width: 900,
    height: 1200,
    loved: false,
    blurDataUrl: "",
    isCover: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "p2",
    galleryId: "g1",
    url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=500&q=60",
    previewUrl:
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1400&q=75",
    originalUrl:
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=2200&q=90",
    order: 2,
    width: 900,
    height: 1350,
    loved: true,
    blurDataUrl: "",
    isCover: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "p3",
    galleryId: "g2",
    url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=60",
    previewUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1400&q=75",
    originalUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=2200&q=90",
    order: 1,
    width: 900,
    height: 1100,
    loved: false,
    blurDataUrl: "",
    isCover: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
];

const galleryDefaults = {
  categoryTags: [] as string[],
  expiresAt: null,
  slideshowEnabled: true,
  socialSharingEnabled: true,
  emailRegistration: false,
  language: "en",
  downloadEnabled: true,
  downloadPin: null,
  downloadSizeOriginal: true,
  downloadSizeHighRes: false,
  downloadSizeWeb: true,
  downloadWebMaxPx: 2048,
  downloadHighResMaxPx: 3600,
  downloadLimit: null,
  favoritesEnabled: true,
  favoriteNotesEnabled: true,
};

const seedGalleries: Gallery[] = [
  {
    id: "g1",
    title: "Sarah + Tom Wedding",
    slug: "sarah-tom-wedding",
    eventDate: new Date(now - 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10),
    deadline: new Date(now + 1000 * 60 * 60 * 24 * 10).toISOString().slice(0, 10),
    passwordEnabled: false,
    password: null,
    isPublished: true,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 12).toISOString(),
    coverPhotoId: "p1",
    ...galleryDefaults,
  },
  {
    id: "g2",
    title: "Chen Family Session",
    slug: "chen-family-session",
    eventDate: new Date(now - 1000 * 60 * 60 * 24 * 4).toISOString().slice(0, 10),
    deadline: new Date(now + 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10),
    passwordEnabled: true,
    password: "1234",
    isPublished: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 3).toISOString(),
    coverPhotoId: "p3",
    ...galleryDefaults,
  },
];

const seedAlbums: Album[] = [
  {
    id: "al1",
    galleryId: "g1",
    title: "Ceremony Highlights",
    downloadEnabled: true,
    photoIds: ["p1", "p2"],
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
];

const seedActivity: Activity[] = [
  {
    id: "a1",
    message: "Published Sarah + Tom Wedding",
    at: new Date(now - 1000 * 60 * 35).toISOString(),
  },
  {
    id: "a2",
    message: "Uploaded 24 photos to Chen Family Session",
    at: new Date(now - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "a3",
    message: "Created gallery Chen Family Session",
    at: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
];

function createStore(): Store {
  return {
    galleries: seedGalleries,
    photos: seedPhotos,
    albums: seedAlbums,
    activity: seedActivity,
    uploadTickets: [],
  };
}

export function getStore() {
  if (!globalThis.__fotnoDashboardStore) {
    globalThis.__fotnoDashboardStore = createStore();
  }
  return globalThis.__fotnoDashboardStore;
}

export function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
