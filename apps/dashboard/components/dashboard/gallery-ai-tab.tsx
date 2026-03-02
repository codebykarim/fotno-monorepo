"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Wand2, CheckCircle2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { apiRequest } from "@/lib/api/client";
import { GetGalleryResponse } from "@/lib/types/api";
import { cn } from "@workspace/ui/lib/utils";

type Props = {
  galleryId: string;
  photos: GetGalleryResponse["gallery"]["photos"];
  mutate: () => Promise<GetGalleryResponse | undefined>;
};

export function GalleryAiTab({ galleryId, photos, mutate }: Props) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedPhotoIds, setSuggestedPhotoIds] = useState<string[]>([]);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(
    new Set(),
  );
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [albumTitle, setAlbumTitle] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe the album you want to generate");
      return;
    }
    setIsGenerating(true);
    setSuggestedPhotoIds([]);
    try {
      const response = await apiRequest<{ suggestedPhotoIds: string[] }>(
        `/api/galleries/${galleryId}/ai/suggest-album`,
        {
          method: "POST",
          body: JSON.stringify({ prompt }),
        },
      );
      if (response.suggestedPhotoIds.length === 0) {
        toast.error("No photos matched your description");
      } else {
        setSuggestedPhotoIds(response.suggestedPhotoIds);
        setSelectedPhotoIds(new Set(response.suggestedPhotoIds));
        setAlbumTitle(
          `AI Album: ${prompt.slice(0, 30)}${prompt.length > 30 ? "..." : ""}`,
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate album suggestions",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateAlbum = async () => {
    if (selectedPhotoIds.size === 0) {
      toast.error("Please select at least one photo");
      return;
    }
    if (!albumTitle.trim()) {
      toast.error("Please provide an album title");
      return;
    }
    setIsCreatingAlbum(true);
    try {
      await apiRequest(`/api/galleries/${galleryId}/albums`, {
        method: "POST",
        body: JSON.stringify({
          title: albumTitle,
          photoIds: Array.from(selectedPhotoIds),
        }),
      });
      toast.success("Album created successfully");
      await mutate();
      handleReset();
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create album",
      );
    } finally {
      setIsCreatingAlbum(false);
    }
  };

  const handleReset = () => {
    setSuggestedPhotoIds([]);
    setSelectedPhotoIds(new Set());
    setPrompt("");
    setAlbumTitle("");
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedPhotoIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedPhotoIds(newSelection);
  };

  const toggleAll = () => {
    if (selectedPhotoIds.size === suggestedPhotoIds.length) {
      setSelectedPhotoIds(new Set());
    } else {
      setSelectedPhotoIds(new Set(suggestedPhotoIds));
    }
  };

  const suggestedPhotos = photos.filter((p) =>
    suggestedPhotoIds.includes(p.id),
  );

  return (
    <div className="space-y-6">
      {suggestedPhotoIds.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Wand2 className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold tracking-tight">
                AI Album Generation
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Describe the album you want to create (e.g., &quot;only images
                where groom and bride are in&quot;), and our AI will select the
                matching photos.
              </p>
            </div>
            <div className="flex w-full max-w-md items-center space-x-2 pt-4">
              <Input
                placeholder="Describe your album..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isGenerating) {
                    void handleGenerate();
                  }
                }}
                disabled={isGenerating}
              />
              <Button
                disabled={isGenerating || !prompt.trim()}
                onClick={() => void handleGenerate()}
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex-1 w-full space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  placeholder="Album Title"
                  className="max-w-xs font-medium"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {selectedPhotoIds.size} of {suggestedPhotoIds.length} selected
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={toggleAll}>
                {selectedPhotoIds.size === suggestedPhotoIds.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={isCreatingAlbum}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Discard
              </Button>
              <Button
                size="sm"
                onClick={() => void handleCreateAlbum()}
                disabled={isCreatingAlbum || selectedPhotoIds.size === 0}
              >
                {isCreatingAlbum && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Album
              </Button>
            </div>
          </div>

          <div className="columns-2 gap-4 md:columns-3 xl:columns-4">
            {suggestedPhotos.map((photo) => {
              const isSelected = selectedPhotoIds.has(photo.id);
              return (
                <div
                  key={photo.id}
                  className="group relative mb-4 cursor-pointer overflow-hidden rounded-xl border border-border bg-muted/30"
                  onClick={() => toggleSelection(photo.id)}
                >
                  <Image
                    src={photo.thumbnailUrl ?? photo.previewUrl ?? photo.url}
                    alt={photo.id}
                    className={cn(
                      "h-auto w-full object-cover transition-all duration-200",
                      isSelected
                        ? "scale-100 opacity-100"
                        : "scale-[0.98] opacity-80 z-0",
                      "group-hover:scale-100 group-hover:opacity-100",
                    )}
                    width={photo.width ?? 1200}
                    height={photo.height ?? 900}
                    sizes="(max-width: 768px) 50vw, (max-width: 1300px) 33vw, 25vw"
                    unoptimized
                  />
                  <div
                    className={cn(
                      "absolute inset-0 ring-inset transition-all duration-200",
                      isSelected
                        ? "bg-primary/10 ring-2 ring-primary"
                        : "bg-black/0 ring-0 group-hover:bg-black/10",
                    )}
                  />
                  <div className="absolute left-3 top-3">
                    <button
                      type="button"
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full border shadow-sm transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-white/50 bg-black/20 text-white/0 hover:border-white hover:bg-black/40 hover:text-white/50",
                      )}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
