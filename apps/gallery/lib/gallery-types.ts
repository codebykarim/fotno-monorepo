export type PhotoVariant = "thumbnail" | "preview" | "original";

export interface PhotographerProfile {
  name: string;
  logoUrl: string | null;
}

export interface PublicPhoto {
  id: string;
  originalFilename: string;
  aiCaption: string | null;
  width: number | null;
  height: number | null;
  order: number;
  blurDataUrl: string;
  thumbnailSrc: string;
  previewSrc: string;
  originalSrc?: string | null;
}

export interface PublicAlbum {
  id: string;
  title: string;
  downloadEnabled: boolean;
  photoIds: string[];
}

export interface GallerySettings {
  slideshowEnabled: boolean;
  socialSharingEnabled: boolean;
  emailRegistration: boolean;
  downloadEnabled: boolean;
  hasDownloadPin: boolean;
  downloadSizes: {
    original: boolean;
    highRes: boolean;
    web: boolean;
  };
  downloadLimit: number | null;
  favoritesEnabled: boolean;
  favoriteNotesEnabled: boolean;
}

export interface PublicGallery {
  id: string;
  userId: string | null;
  shareToken: string;
  title: string;
  hasPassword: boolean;
  photographer: PhotographerProfile;
  coverPhotoId: string | null;
  settings?: GallerySettings;
  photos: PublicPhoto[];
  albums?: PublicAlbum[];
}

export interface GalleryApiResponse {
  gallery: PublicGallery;
}
