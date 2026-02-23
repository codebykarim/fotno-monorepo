export type GalleryStatus = "draft" | "published";

export type Photo = {
  id: string;
  galleryId: string;
  url: string;
  order: number;
  width: number;
  height: number;
  loved: boolean;
  createdAt: string;
};

export type Gallery = {
  id: string;
  title: string;
  slug: string;
  eventDate: string | null;
  deadline: string | null;
  passwordEnabled: boolean;
  password: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  coverPhotoId: string | null;
};

export type Album = {
  id: string;
  galleryId: string;
  title: string;
  photoIds: string[];
  createdAt: string;
};

export type GalleryWithPhotos = Gallery & {
  photos: Photo[];
  albums: Album[];
};

export type Client = {
  id: string;
  name: string;
  email: string;
  galleryIds: string[];
};

export type Activity = {
  id: string;
  message: string;
  at: string;
  type?: "upload" | "gallery_update" | "delivery" | "system";
  severity?: "info" | "success" | "warning";
};

export type UploadTicket = {
  uploadId: string;
  galleryId: string;
  fileName: string;
  fileType: string;
  size: number;
  uploaded: boolean;
};
