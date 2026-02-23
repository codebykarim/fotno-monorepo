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
  photoIds: string[];
}

export interface PublicGallery {
  id: string;
  shareToken: string;
  title: string;
  hasPassword: boolean;
  photographer: PhotographerProfile;
  coverPhotoId: string | null;
  photos: PublicPhoto[];
  albums?: PublicAlbum[];
}

export interface GalleryApiResponse {
  gallery: PublicGallery;
}
