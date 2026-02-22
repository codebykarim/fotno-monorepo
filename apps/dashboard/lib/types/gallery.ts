export type GalleryStatus = "draft" | "published";

export type Photo = {
  id: string;
  galleryId: string;
  url: string;
  order: number;
  width: number;
  height: number;
  createdAt: string;
};

export type Gallery = {
  id: string;
  title: string;
  slug: string;
  passwordEnabled: boolean;
  password: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  coverPhotoId: string | null;
};

export type GalleryWithPhotos = Gallery & {
  photos: Photo[];
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
};

export type UploadTicket = {
  uploadId: string;
  galleryId: string;
  fileName: string;
  fileType: string;
  size: number;
  uploaded: boolean;
};
