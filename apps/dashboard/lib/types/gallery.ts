export type GalleryStatus = "draft" | "published";

export type Photo = {
  id: string;
  galleryId: string;
  url: string;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  originalUrl: string | null;
  blurDataUrl: string | null;
  order: number;
  width: number;
  height: number;
  loved: boolean;
  isCover: boolean;
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
  aiContext: string | null;
  // General settings
  categoryTags: string[];
  expiresAt: string | null;
  slideshowEnabled: boolean;
  socialSharingEnabled: boolean;
  emailRegistration: boolean;
  language: string;
  // Download settings
  downloadEnabled: boolean;
  downloadPin: string | null;
  downloadSizeOriginal: boolean;
  downloadSizeHighRes: boolean;
  downloadSizeWeb: boolean;
  downloadWebMaxPx: number;
  downloadHighResMaxPx: number;
  downloadLimit: number | null;
  downloadContactsOnly: boolean;
  // Favorites settings
  favoritesEnabled: boolean;
  favoriteNotesEnabled: boolean;
};

export type Album = {
  id: string;
  galleryId: string;
  title: string;
  downloadEnabled: boolean;
  photoIds: string[];
  createdAt: string;
};

export type GalleryWithPhotos = Gallery & {
  photoCount: number;
  albums: Album[];
};

export type GetGalleryPhotosResponse = {
  photos: Photo[];
  total: number;
  limit: number;
  offset: number;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  galleryIds: string[];
};

export type Activity = {
  id: string;
  message: string;
  at: string;
  type?: "upload" | "gallery_update" | "delivery" | "system";
  severity?: "info" | "success" | "warning";
};

export type FailedPhoto = {
  id: string;
  originalFilename: string;
  url: string;
};

export type PhotoProcessingStatus = {
  total: number;
  processed: number;
  failed: number;
  inProgress: number;
  stuck: number;
  done: boolean;
  failedPhotos: FailedPhoto[];
};

export type UploadTicket = {
  uploadId: string;
  galleryId: string;
  fileName: string;
  fileType: string;
  size: number;
  uploaded: boolean;
};
