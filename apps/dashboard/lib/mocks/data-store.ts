import { Activity, Client, Gallery, Photo, UploadTicket } from "@/lib/types/gallery";

type Store = {
  galleries: Gallery[];
  photos: Photo[];
  clients: Client[];
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
    order: 1,
    width: 900,
    height: 1200,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "p2",
    galleryId: "g1",
    url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80",
    order: 2,
    width: 900,
    height: 1350,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "p3",
    galleryId: "g2",
    url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
    order: 1,
    width: 900,
    height: 1100,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
];

const seedGalleries: Gallery[] = [
  {
    id: "g1",
    title: "Sarah + Tom Wedding",
    slug: "sarah-tom-wedding",
    passwordEnabled: false,
    password: null,
    isPublished: true,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 12).toISOString(),
    coverPhotoId: "p1",
  },
  {
    id: "g2",
    title: "Chen Family Session",
    slug: "chen-family-session",
    passwordEnabled: true,
    password: "1234",
    isPublished: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 3).toISOString(),
    coverPhotoId: "p3",
  },
];

const seedClients: Client[] = [
  {
    id: "c1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    galleryIds: ["g1"],
  },
  {
    id: "c2",
    name: "Mike Chen",
    email: "mike@example.com",
    galleryIds: ["g2"],
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
    clients: seedClients,
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
