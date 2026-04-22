"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  Album,
  BookImage,
  CalendarDays,
  ExternalLink,
  FolderKanban,
  Grid2x2,
  Images,
  Link2,
  MessageSquare,
  Lock,
  LockOpen,
  QrCode,
  Settings2,
  Share2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Switch } from "@workspace/ui/components/switch";
import { cn } from "@workspace/ui/lib/utils";
import { apiRequest } from "@/lib/api/client";
import { useCustomDomain } from "@/lib/hooks/use-custom-domain";
import { getGalleryShareLink } from "@/lib/utils/gallery-link";
import { useGalleryDetail } from "./gallery-detail-provider";

const TABS = [
  { id: "photos", label: "Photos", icon: Grid2x2, segment: "" },
  // { id: "albums", label: "Albums", icon: Album, segment: "/albums" },
  {
    id: "smart-albums",
    label: "Smart Albums",
    icon: BookImage,
    segment: "/smart-albums",
  },
  {
    id: "comments",
    label: "Comments",
    icon: MessageSquare,
    segment: "/comments",
  },
  { id: "share", label: "Share", icon: Share2, segment: "/share" },
  { id: "settings", label: "Settings", icon: Settings2, segment: "/settings" },
] as const;

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "\u2014";
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// getGalleryShareLink is now imported from @/lib/utils/gallery-link

function countAllComments(comments: any[]): number {
  let total = 0;
  for (const c of comments) {
    total += 1;
    if (c.replies?.length) total += countAllComments(c.replies);
  }
  return total;
}

function useNewCommentCount(galleryId: string, activeTab: string) {
  const [newCount, setNewCount] = useState(0);
  const storageKey = `comments-seen-${galleryId}`;

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch(`/api/galleries/${galleryId}/comments`);
      if (!res.ok) return;
      const json = await res.json();
      const total = countAllComments(json.comments ?? []);
      const seen = parseInt(localStorage.getItem(storageKey) ?? "0", 10);
      setNewCount(Math.max(0, total - seen));
    } catch {}
  }, [galleryId, storageKey]);

  // Fetch on mount and every 30s
  useEffect(() => {
    fetchCount();
    const id = setInterval(fetchCount, 30_000);
    return () => clearInterval(id);
  }, [fetchCount]);

  // When user clicks Comments tab, mark all as seen
  useEffect(() => {
    if (activeTab === "comments") {
      // Get current total and store it
      fetch(`/api/galleries/${galleryId}/comments`)
        .then((r) => (r.ok ? r.json() : null))
        .then((json) => {
          if (!json) return;
          const total = countAllComments(json.comments ?? []);
          localStorage.setItem(storageKey, String(total));
          setNewCount(0);
        })
        .catch(() => {});
    }
  }, [activeTab, galleryId, storageKey]);

  return newCount;
}

export function GalleryDetailHeader() {
  const { galleryId, data, mutate, isLoading, processingStatus } =
    useGalleryDetail();
  const { verifiedDomain } = useCustomDomain();
  const pathname = usePathname();
  const [publishSaving, setPublishSaving] = useState(false);

  // Disable publish only when photos are actively being processed
  // (not stuck, not just failed — real work happening)
  const isActivelyProcessing = processingStatus
    ? !processingStatus.done &&
      processingStatus.inProgress > processingStatus.stuck
    : false;

  const basePath = `/galleries/${galleryId}`;

  const activeTab = (() => {
    const relative = pathname.replace(basePath, "");
    for (const tab of TABS) {
      if (tab.segment && relative.startsWith(tab.segment)) return tab.id;
    }
    return "photos";
  })();

  const newCommentCount = useNewCommentCount(galleryId, activeTab);

  if (isLoading || !data) {
    return (
      <div className="space-y-5">
        <div className="space-y-3">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex gap-6 border-b border-border pb-px">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-16" />
          ))}
        </div>
      </div>
    );
  }

  const shareLink = getGalleryShareLink(data.gallery.slug, verifiedDomain);

  const togglePublish = async () => {
    setPublishSaving(true);
    try {
      await apiRequest(`/api/galleries/${galleryId}`, {
        method: "PATCH",
        body: JSON.stringify({ isPublished: !data.gallery.isPublished }),
      });
      await mutate();
      toast.success(
        data.gallery.isPublished ? "Gallery unpublished" : "Gallery published",
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update");
    } finally {
      setPublishSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <section className="space-y-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="dashboard-title text-2xl font-semibold tracking-tight truncate">
              {data.gallery.title}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              /{data.gallery.slug}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Publish toggle */}
            <div
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5"
              title={
                isActivelyProcessing ? "Photos are still processing" : undefined
              }
            >
              <Switch
                checked={data.gallery.isPublished}
                onCheckedChange={togglePublish}
                disabled={
                  publishSaving ||
                  (isActivelyProcessing && !data.gallery.isPublished)
                }
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  data.gallery.isPublished
                    ? "text-emerald-600"
                    : "text-muted-foreground",
                )}
              >
                {isActivelyProcessing && !data.gallery.isPublished
                  ? "Processing..."
                  : data.gallery.isPublished
                    ? "Published"
                    : "Draft"}
              </span>
            </div>

            {/* Password status indicator */}
            <div
              className="flex h-8 items-center rounded-md border border-border px-2"
              title={
                data.gallery.passwordEnabled
                  ? "Password protected"
                  : "No password"
              }
            >
              {data.gallery.passwordEnabled ? (
                <Lock className="h-3.5 w-3.5 text-primary" />
              ) : (
                <LockOpen className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>

            {/* Preview */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              disabled={!data.gallery.isPublished}
              asChild
            >
              <a
                href={getGalleryShareLink(data.gallery.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-1.5",
                  !data.gallery.isPublished && "opacity-50 pointer-events-none",
                )}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-xs">Preview</span>
              </a>
            </Button>

            {/* Copy link */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              disabled={!data.gallery.isPublished}
              onClick={() => {
                navigator.clipboard.writeText(shareLink);
                toast.success("Share link copied");
              }}
            >
              <Link2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs">Copy link</span>
            </Button>

            {/* QR popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  disabled={!data.gallery.isPublished}
                >
                  <QrCode className="h-3.5 w-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-auto p-4">
                <div className="space-y-3">
                  <p className="text-sm font-medium">Gallery QR Code</p>
                  <div
                    id="qr-popover-svg"
                    className="flex items-center justify-center rounded-lg border bg-white p-3"
                  >
                    <QRCodeSVG
                      value={shareLink}
                      size={180}
                      level="H"
                      includeMargin={false}
                      bgColor="#ffffff"
                      fgColor="#0f172a"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const svg = document.querySelector("#qr-popover-svg svg");
                      if (!svg) return;
                      const source = new XMLSerializer().serializeToString(svg);
                      const blob = new Blob([source], {
                        type: "image/svg+xml;charset=utf-8",
                      });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = `${data.gallery.slug}-qr.svg`;
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Download SVG
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Stats pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1">
            <Images className="h-3 w-3" />
            {data.gallery.photoCount} photo
            {data.gallery.photoCount !== 1 ? "s" : ""}
          </span>

          {data.gallery.eventDate && (
            <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1">
              <CalendarDays className="h-3 w-3" />
              {formatDate(data.gallery.eventDate)}
            </span>
          )}
          {data.gallery.deadline && (
            <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1">
              Event deadline {formatDate(data.gallery.deadline)}
            </span>
          )}
        </div>
      </section>

      {/* ── Tabs ── */}
      <div className="flex gap-1 border-b border-border">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.id}
              href={`${basePath}${tab.segment}`}
              className={cn(
                "relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {tab.id === "comments" && newCommentCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {newCommentCount > 99 ? "99+" : newCommentCount}
                </span>
              )}
              {isActive && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
