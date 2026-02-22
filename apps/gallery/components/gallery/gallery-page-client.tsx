"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Download, DownloadCloud } from "lucide-react";
import { toast } from "sonner";
import PasswordGate from "@/components/gallery/password-gate";
import { getSessionTokenKey, isJwtLikelyValid } from "@/lib/jwt";
import type { GalleryApiResponse, PublicGallery } from "@/lib/gallery-types";

type GalleryPageClientProps = {
  initialGallery: PublicGallery;
};

const readStoredToken = (shareToken: string): string | null => {
  const token = sessionStorage.getItem(getSessionTokenKey(shareToken));
  if (!token) {
    return null;
  }

  if (!isJwtLikelyValid(token)) {
    sessionStorage.removeItem(getSessionTokenKey(shareToken));
    return null;
  }

  return token;
};

const readErrorText = async (response: Response): Promise<string> => {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error ?? "Request failed";
  } catch {
    return "Request failed";
  }
};

export default function GalleryPageClient({ initialGallery }: GalleryPageClientProps) {
  const [gallery, setGallery] = useState(initialGallery);
  const [galleryJwt, setGalleryJwt] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  useEffect(() => {
    if (!gallery.hasPassword) {
      return;
    }

    const token = readStoredToken(gallery.shareToken);
    if (!token) {
      return;
    }

    setGalleryJwt(token);
    void refreshGallery(token).catch(() => {
      sessionStorage.removeItem(getSessionTokenKey(gallery.shareToken));
      setGalleryJwt(null);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gallery.shareToken, gallery.hasPassword]);

  const isUnlocked = !gallery.hasPassword || Boolean(galleryJwt);

  const photoCountLabel = useMemo(() => {
    const total = gallery.photos.length;
    return `${total} ${total === 1 ? "photo" : "photos"}`;
  }, [gallery.photos.length]);

  const refreshGallery = async (token?: string) => {
    const response = await fetch(`/api/gallery/${gallery.shareToken}`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await readErrorText(response));
    }

    const payload = (await response.json()) as GalleryApiResponse;
    setGallery(payload.gallery);
  };

  const unlockGallery = async (password: string) => {
    setIsUnlocking(true);
    try {
      const response = await fetch(`/api/gallery/${gallery.shareToken}/unlock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error(await readErrorText(response));
      }

      const payload = (await response.json()) as {
        token?: string;
      };

      if (!payload.token) {
        throw new Error("Unlock token was not returned");
      }

      sessionStorage.setItem(getSessionTokenKey(gallery.shareToken), payload.token);
      setGalleryJwt(payload.token);
      await refreshGallery(payload.token);
      toast.success("Gallery unlocked");
    } catch (error) {
      sessionStorage.removeItem(getSessionTokenKey(gallery.shareToken));
      setGalleryJwt(null);
      const message = error instanceof Error ? error.message : "Unable to unlock";
      toast.error(message);
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleSingleDownload = async (photoId: string, filename: string) => {
    try {
      const response = await fetch(
        `/api/photos/${photoId}/url?shareToken=${encodeURIComponent(gallery.shareToken)}&variant=original`,
        {
          headers: galleryJwt
            ? {
                Authorization: `Bearer ${galleryJwt}`,
              }
            : undefined,
        }
      );

      if (!response.ok) {
        throw new Error(await readErrorText(response));
      }

      const payload = (await response.json()) as { url: string };
      const link = document.createElement("a");
      link.href = payload.url;
      link.download = filename;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Download failed";
      toast.error(message);
    }
  };

  const handleDownloadAll = async () => {
    setIsDownloadingAll(true);

    try {
      const response = await fetch(`/api/gallery/${gallery.shareToken}/download-all`, {
        headers: galleryJwt
          ? {
              Authorization: `Bearer ${galleryJwt}`,
            }
          : undefined,
      });

      if (!response.ok) {
        throw new Error(await readErrorText(response));
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `${gallery.title.replace(/\s+/g, "-").toLowerCase()}.zip`;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to download ZIP";
      toast.error(message);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  if (!isUnlocked) {
    return (
      <PasswordGate
        title={gallery.title}
        onUnlock={unlockGallery}
        isSubmitting={isUnlocking}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f3f4f6_0,#e5e7eb_18%,#f8fafc_65%)]">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/85 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {gallery.photographer.logoUrl ? (
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-black/10">
                <Image
                  src={gallery.photographer.logoUrl}
                  alt={`${gallery.photographer.name} logo`}
                  fill
                  sizes="48px"
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : null}
            <div>
              <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">{gallery.title}</h1>
              <p className="text-sm text-slate-600">
                {gallery.photographer.name} • {photoCountLabel}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadAll}
            disabled={isDownloadingAll}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <DownloadCloud className="h-4 w-4" />
            {isDownloadingAll ? "Preparing ZIP..." : "Download All"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div className="columns-2 gap-3 space-y-3 md:columns-3 md:gap-4 md:space-y-4 xl:columns-4">
          {gallery.photos.map((photo) => {
            const imageSrc = galleryJwt
              ? `${photo.thumbnailSrc}&token=${encodeURIComponent(galleryJwt)}`
              : photo.thumbnailSrc;

            return (
              <div
                key={photo.id}
                className="group relative mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-slate-200 md:mb-4"
              >
                <Link href={`/${gallery.shareToken}/photo/${photo.id}`} className="block">
                  <Image
                    src={imageSrc}
                    alt={photo.aiCaption ?? photo.originalFilename}
                    width={photo.width ?? 1200}
                    height={photo.height ?? 900}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    placeholder="blur"
                    blurDataURL={photo.blurDataUrl}
                    className="h-auto w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                </Link>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <button
                  type="button"
                  onClick={() => handleSingleDownload(photo.id, photo.originalFilename)}
                  className="absolute right-3 bottom-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 opacity-0 shadow-sm transition group-hover:opacity-100"
                  aria-label="Download photo"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-black/10 px-4 py-6 text-center text-sm text-slate-500 md:px-8">
        Powered by FOTNO
      </footer>
    </div>
  );
}
