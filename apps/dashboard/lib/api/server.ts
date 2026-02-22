import { getStore } from "@/lib/mocks/data-store";
import { Gallery, GalleryStatus, GalleryWithPhotos } from "@/lib/types/gallery";

export function listGalleries(options?: {
  query?: string;
  status?: GalleryStatus | "all";
  sort?: "newest" | "oldest" | "title_asc" | "title_desc";
}) {
  const store = getStore();
  const query = options?.query?.toLowerCase().trim();
  const status = options?.status ?? "all";
  const sort = options?.sort ?? "newest";

  let galleries = store.galleries.filter((gallery) => {
    const matchesQuery = query
      ? gallery.title.toLowerCase().includes(query) || gallery.slug.toLowerCase().includes(query)
      : true;
    const matchesStatus =
      status === "all"
        ? true
        : status === "published"
          ? gallery.isPublished
          : !gallery.isPublished;
    return matchesQuery && matchesStatus;
  });

  galleries = galleries.sort((a, b) => {
    if (sort === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sort === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sort === "title_asc") {
      return a.title.localeCompare(b.title);
    }
    return b.title.localeCompare(a.title);
  });

  return galleries.map((gallery) => {
    const photos = store.photos.filter((photo) => photo.galleryId === gallery.id);
    const cover = photos.find((photo) => photo.id === gallery.coverPhotoId) ?? photos[0] ?? null;

    return {
      ...gallery,
      status: gallery.isPublished ? "published" : "draft",
      photoCount: photos.length,
      coverPhotoUrl: cover?.url ?? null,
    };
  });
}

export function getGalleryWithPhotos(id: string): GalleryWithPhotos | null {
  const store = getStore();
  const gallery = store.galleries.find((g) => g.id === id);
  if (!gallery) {
    return null;
  }

  const photos = store.photos
    .filter((photo) => photo.galleryId === id)
    .sort((a, b) => a.order - b.order);
  const albums = store.albums
    .filter((album) => album.galleryId === id)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return {
    ...gallery,
    photos,
    albums,
  };
}

export function updateGallery(id: string, patch: Partial<Gallery>) {
  const store = getStore();
  const index = store.galleries.findIndex((g) => g.id === id);
  if (index === -1) {
    return null;
  }
  const current = store.galleries[index];
  if (!current) {
    return null;
  }

  const updated = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  store.galleries[index] = updated;
  return updated;
}
