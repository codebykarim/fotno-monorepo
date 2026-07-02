"use client";

import { useEffect, useState } from "react";
import { Heart, Image as ImageIcon, Loader2, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { apiRequest } from "@/lib/api/client";
import { GetGalleryResponse } from "@/lib/types/api";
import { FeatureGate } from "@/components/dashboard/feature-gate";
import { useHasFeature } from "@/lib/hooks/use-features";

type FavoritePhoto = {
  id: string;
  thumbnailUrl: string;
  previewUrl: string;
  originalUrl: string;
  originalFilename: string;
};

type FavoriteViewer = {
  viewerId: string;
  viewerName: string;
  count: number;
  favorites: {
    id: string;
    photoId: string;
    note: string | null;
    createdAt: string;
    photo: FavoritePhoto | null;
  }[];
};

type FavoriteItem = FavoriteViewer["favorites"][number];

type Props = {
  galleryId: string;
  data: GetGalleryResponse;
  mutate: () => Promise<GetGalleryResponse | undefined>;
};

export function FavoritesSettings({ galleryId, data, mutate }: Props) {
  const g = data.gallery;
  const [enabled, setEnabled] = useState(g.favoritesEnabled);
  const [notesEnabled, setNotesEnabled] = useState(g.favoriteNotesEnabled);
  const [saving, setSaving] = useState(false);
  const hasFeature = useHasFeature("CLIENT_FAVORITES");

  async function onSave() {
    setSaving(true);
    try {
      await apiRequest(`/api/galleries/${galleryId}`, {
        method: "PATCH",
        body: JSON.stringify({
          favoritesEnabled: enabled,
          favoriteNotesEnabled: notesEnabled,
        }),
      });
      await mutate();
      toast.success("Favorites settings saved");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save settings",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold">Favorites</h3>
        <p className="text-sm text-muted-foreground">
          Let clients mark their favorite photos and leave notes.
        </p>
      </div>

      <FeatureGate featureKey="CLIENT_FAVORITES">
        {/* Master toggle */}
        <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Enable Favorites</h4>
              <p className="text-xs text-muted-foreground">
                Allow clients to mark photos as favorites. Favorites are saved
                server-side and visible to you in the activity view.
              </p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>
        </section>

        {enabled && (
          <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Favorite Notes</h4>
                <p className="text-xs text-muted-foreground">
                  Allow clients to add a note when favoriting a photo (e.g.
                  &ldquo;print this one&rdquo; or &ldquo;use as album
                  cover&rdquo;).
                </p>
              </div>
              <Switch
                checked={notesEnabled}
                onCheckedChange={setNotesEnabled}
              />
            </div>
          </section>
        )}

        <Button onClick={onSave} disabled={saving} className="w-full sm:w-auto">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save favorites settings"
          )}
        </Button>
        {enabled && (
          <FavoritesActivity galleryId={galleryId} hasFeature={hasFeature} />
        )}
      </FeatureGate>
    </div>
  );
}

function FavoritesActivity({
  galleryId,
  hasFeature,
}: {
  galleryId: string;
  hasFeature: boolean;
}) {
  const [viewers, setViewers] = useState<FavoriteViewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [lightboxFavorite, setLightboxFavorite] = useState<FavoriteItem | null>(
    null,
  );

  useEffect(() => {
    setLoading(true);
    apiRequest<{ viewers?: FavoriteViewer[]; total?: number }>(
      `/api/galleries/${galleryId}/favorites`,
    )
      .then((data) => {
        setViewers(data.viewers ?? []);
        setTotal(data.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [galleryId]);

  if (!hasFeature) {
    return (
      <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h4 className="text-sm font-medium">Favorites Activity</h4>
        <p className="text-xs text-muted-foreground">
          Upgrade your plan to unlock this feature.
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (viewers.length === 0) {
    return (
      <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h4 className="text-sm font-medium">Favorites Activity</h4>
        <p className="text-xs text-muted-foreground">
          No one has favorited any photos yet.
        </p>
      </section>
    );
  }

  const isPhone = (id: string) => id.startsWith("+");

  return (
    <>
      <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Favorites Activity</h4>
          <span className="text-xs text-muted-foreground">
            {total} total {total === 1 ? "favorite" : "favorites"}
          </span>
        </div>
        <div className="space-y-3">
          {viewers.map((viewer) => (
            <div
              key={viewer.viewerId}
              className="space-y-3 rounded-lg border border-border/50 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  {isPhone(viewer.viewerId) ? (
                    <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  ) : (
                    <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  )}
                  <div className="min-w-0">
                    {viewer.viewerName && (
                      <span className="block truncate text-sm font-medium">
                        {viewer.viewerName}
                      </span>
                    )}
                    {isPhone(viewer.viewerId) && (
                      <span className="block truncate text-xs text-muted-foreground">
                        {viewer.viewerId}
                      </span>
                    )}
                    {!viewer.viewerName && !isPhone(viewer.viewerId) && (
                      <span className="text-sm text-muted-foreground">
                        Anonymous
                      </span>
                    )}
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <Heart className="h-3 w-3" />
                  {viewer.count}
                </span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {viewer.favorites.map((favorite) => (
                  <button
                    key={favorite.id}
                    type="button"
                    onClick={() =>
                      favorite.photo && setLightboxFavorite(favorite)
                    }
                    disabled={!favorite.photo}
                    title={favorite.photo?.originalFilename ?? "Deleted photo"}
                    className="group flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/40 p-1.5 text-left transition-shadow hover:ring-2 hover:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="h-14 w-14 shrink-0 overflow-hidden rounded border border-border bg-muted">
                      {favorite.photo ? (
                        <img
                          src={favorite.photo.thumbnailUrl}
                          alt={favorite.photo.originalFilename}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium">
                        {favorite.photo?.originalFilename ?? "Deleted photo"}
                      </span>
                      {favorite.note && (
                        <span className="mt-1 line-clamp-2 block text-xs text-muted-foreground">
                          {favorite.note}
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Dialog
        open={!!lightboxFavorite?.photo}
        onOpenChange={(open) => !open && setLightboxFavorite(null)}
      >
        <DialogContent className="max-w-5xl max-h-fit p-2 sm:p-4">
          <DialogTitle className="sr-only">
            {lightboxFavorite?.photo?.originalFilename ?? "Favorite photo"}
          </DialogTitle>
          {lightboxFavorite?.photo && (
            <div className="flex flex-col items-center gap-3">
              <img
                src={
                  lightboxFavorite.photo.originalUrl ??
                  lightboxFavorite.photo.previewUrl
                }
                alt={lightboxFavorite.photo.originalFilename}
                className="max-h-[80vh] w-auto rounded-lg object-contain"
              />
              <div className="max-w-full space-y-1 text-center">
                <p className="truncate text-sm text-muted-foreground">
                  {lightboxFavorite.photo.originalFilename}
                </p>
                {lightboxFavorite.note && (
                  <p className="max-w-2xl text-sm">{lightboxFavorite.note}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
