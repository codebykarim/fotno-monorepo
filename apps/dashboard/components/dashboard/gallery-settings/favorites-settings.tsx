"use client";

import { useEffect, useState } from "react";
import { Heart, Loader2, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import { apiRequest } from "@/lib/api/client";
import { GetGalleryResponse } from "@/lib/types/api";

type FavoriteViewer = {
  viewerId: string;
  viewerName: string;
  count: number;
  favorites: {
    id: string;
    photoId: string;
    note: string | null;
    createdAt: string;
  }[];
};

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
        <FavoritesActivity galleryId={galleryId} />
      )}
    </div>
  );
}

function FavoritesActivity({ galleryId }: { galleryId: string }) {
  const [viewers, setViewers] = useState<FavoriteViewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

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
            className="rounded-lg border border-border/50 p-3 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isPhone(viewer.viewerId) ? (
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <div>
                  {viewer.viewerName && (
                    <span className="text-sm font-medium">
                      {viewer.viewerName}
                    </span>
                  )}
                  {isPhone(viewer.viewerId) && (
                    <span className="ml-2 text-xs text-muted-foreground">
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
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Heart className="h-3 w-3" />
                {viewer.count}
              </span>
            </div>
            {viewer.favorites.some((f) => f.note) && (
              <div className="space-y-1.5 pl-5 mt-1">
                {viewer.favorites
                  .filter((f) => f.note)
                  .map((f) => (
                    <div
                      key={f.id}
                      className="flex items-start gap-2 text-xs"
                    >
                      <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {f.photoId.slice(0, 8)}
                      </span>
                      <span className="text-muted-foreground italic">
                        &ldquo;{f.note}&rdquo;
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
