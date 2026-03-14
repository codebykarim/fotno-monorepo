"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { jsonFetcher } from "@/lib/api/client";

export interface SourceItem {
  id: string;
  name: string;
}

export interface FolderMapping {
  sourceId: string;
  sourceName: string;
  galleryId?: string;
  newGallery?: {
    title: string;
  };
}

interface GalleryOption {
  id: string;
  title: string;
}

interface ListGalleriesResponse {
  galleries: GalleryOption[];
}

export function ImportConfig({
  items,
  onStartImport,
  importing,
}: {
  items: SourceItem[];
  onStartImport: (mappings: FolderMapping[]) => void;
  importing: boolean;
}) {
  const { data: galleriesData } = useSWR<ListGalleriesResponse>(
    "/api/galleries?status=all&sort=newest",
    jsonFetcher,
  );

  const [configs, setConfigs] = useState<
    Record<
      string,
      { mode: "new" | "existing"; galleryId: string; title: string }
    >
  >(() => {
    const initial: Record<
      string,
      { mode: "new" | "existing"; galleryId: string; title: string }
    > = {};
    for (const item of items) {
      initial[item.id] = { mode: "new", galleryId: "", title: item.name };
    }
    return initial;
  });

  function updateConfig(
    itemId: string,
    update: Partial<{
      mode: "new" | "existing";
      galleryId: string;
      title: string;
    }>,
  ) {
    setConfigs((prev) => {
      const existing = prev[itemId] ?? {
        mode: "new" as const,
        galleryId: "",
        title: "",
      };
      return { ...prev, [itemId]: { ...existing, ...update } };
    });
  }

  function handleSubmit() {
    const mappings: FolderMapping[] = items.map((item) => {
      const config = configs[item.id];
      if (config?.mode === "existing" && config.galleryId) {
        return {
          sourceId: item.id,
          sourceName: item.name,
          galleryId: config.galleryId,
        };
      }
      return {
        sourceId: item.id,
        sourceName: item.name,
        newGallery: { title: config?.title || item.name },
      };
    });
    onStartImport(mappings);
  }

  const galleries = galleriesData?.galleries ?? [];

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const config = configs[item.id] ?? {
          mode: "new" as const,
          galleryId: "",
          title: item.name,
        };

        return (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button
                  variant={config.mode === "new" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateConfig(item.id, { mode: "new" })}
                >
                  New Gallery
                </Button>
                <Button
                  variant={config.mode === "existing" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateConfig(item.id, { mode: "existing" })}
                >
                  Existing Gallery
                </Button>
              </div>

              {config.mode === "new" && (
                <div className="space-y-1.5">
                  <Label htmlFor={`title-${item.id}`} className="text-xs">
                    Gallery Title
                  </Label>
                  <Input
                    id={`title-${item.id}`}
                    value={config.title}
                    onChange={(e) =>
                      updateConfig(item.id, { title: e.target.value })
                    }
                    placeholder="Gallery title"
                    className="h-8 text-sm"
                  />
                </div>
              )}

              {config.mode === "existing" && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Select Gallery</Label>
                  <Select
                    value={config.galleryId || undefined}
                    onValueChange={(value) =>
                      updateConfig(item.id, { galleryId: value })
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Choose a gallery..." />
                    </SelectTrigger>
                    <SelectContent>
                      {galleries.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      <Button onClick={handleSubmit} disabled={importing} className="w-full">
        {importing ? "Starting Import..." : "Start Import"}
      </Button>
    </div>
  );
}
