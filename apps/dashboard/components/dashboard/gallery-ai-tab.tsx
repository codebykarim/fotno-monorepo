"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Loader2,
  Wand2,
  CheckCircle2,
  RotateCcw,
  Pencil,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Progress } from "@workspace/ui/components/progress";
import { apiRequest } from "@/lib/api/client";
import { GetGalleryResponse } from "@/lib/types/api";
import { cn } from "@workspace/ui/lib/utils";

interface AiStatus {
  totalPhotos: number;
  ingested: number;
  embedded: number;
  captioned: number;
  failed: number;
  ready: boolean;
}

type Props = {
  galleryId: string;
  photos: GetGalleryResponse["gallery"]["photos"];
  aiContext: string | null;
  mutate: () => Promise<GetGalleryResponse | undefined>;
};

export function GalleryAiTab({ galleryId, photos, aiContext, mutate }: Props) {
  // Status polling
  const [status, setStatus] = useState<AiStatus | null>(null);
  const [statusError, setStatusError] = useState(false);

  // Context editing
  const [contextDraft, setContextDraft] = useState(aiContext ?? "");
  const [isEditingContext, setIsEditingContext] = useState(false);
  const [isSavingContext, setIsSavingContext] = useState(false);
  const [contextExpanded, setContextExpanded] = useState(false);
  const [skippedContext, setSkippedContext] = useState(false);

  // Album generation (same as before)
  const [prompt, setPrompt] = useState("I want all photos ");
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedPhotoIds, setSuggestedPhotoIds] = useState<string[]>([]);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(
    new Set(),
  );
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [albumTitle, setAlbumTitle] = useState("");

  const fetchStatus = useCallback(async () => {
    try {
      const res = await apiRequest<AiStatus>(
        `/api/galleries/${galleryId}/ai/status`,
      );
      setStatus(res);
      setStatusError(false);
    } catch {
      setStatusError(true);
    }
  }, [galleryId]);

  // Poll status every 5 seconds while not ready
  useEffect(() => {
    void fetchStatus();
    const interval = setInterval(() => {
      if (!status?.ready) {
        void fetchStatus();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchStatus, status?.ready]);

  // Sync context draft when aiContext prop changes
  useEffect(() => {
    setContextDraft(aiContext ?? "");
  }, [aiContext]);

  const handleSaveContext = async () => {
    setIsSavingContext(true);
    try {
      await apiRequest(`/api/galleries/${galleryId}`, {
        method: "PATCH",
        body: JSON.stringify({ aiContext: contextDraft.trim() || null }),
      });
      toast.success("Gallery context saved");
      await mutate();
      setIsEditingContext(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save context",
      );
    } finally {
      setIsSavingContext(false);
    }
  };

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

  // State A: Not ready (still processing)
  if (status && !status.ready) {
    const progressTotal = status.totalPhotos || status.ingested || 1;
    const progressPercent = Math.round((status.embedded / progressTotal) * 100);

    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm text-center space-y-6">
          <div className="mx-auto rounded-full bg-primary/10 p-4 w-fit">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight">
              Preparing photos for AI
            </h3>
            <p className="text-sm text-muted-foreground">
              {status.embedded} of {progressTotal} photos ready
            </p>
          </div>
          <Progress value={progressPercent} className="w-full" />
          {status.failed > 0 && (
            <p className="text-xs text-muted-foreground">
              {status.failed} photo{status.failed !== 1 ? "s" : ""} failed to
              process
            </p>
          )}
        </div>
      </div>
    );
  }

  // Loading state
  if (!status) {
    if (statusError) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Unable to check AI processing status. The AI service may not be
              running.
            </p>
            <Button variant="outline" size="sm" onClick={() => void fetchStatus()}>
              Retry
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
      </div>
    );
  }

  // State B: Ready, no context set yet (and not skipped)
  if (!aiContext && !skippedContext && !isEditingContext) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-full max-w-lg rounded-xl border border-border bg-card p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto rounded-full bg-primary/10 p-4 w-fit">
              <BrainCircuit className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">
              Tell the AI about this gallery
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Adding context helps the AI understand your photos better, leading
              to more accurate search results and album suggestions.
            </p>
          </div>
          <textarea
            className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            placeholder="e.g. Wedding session for Sarah & John. Outdoor ceremony, indoor reception. Main subjects: bride in white dress, groom in navy suit."
            value={contextDraft}
            onChange={(e) => setContextDraft(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setSkippedContext(true)}
            >
              Skip for now
            </button>
            <Button
              onClick={() => void handleSaveContext()}
              disabled={!contextDraft.trim() || isSavingContext}
            >
              {isSavingContext && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Context
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // State C: Ready with optional context (main UI)
  return (
    <div className="space-y-6">
      {/* Context summary / edit */}
      {aiContext && !isEditingContext && (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-medium"
              onClick={() => setContextExpanded(!contextExpanded)}
            >
              <BrainCircuit className="h-4 w-4 text-primary" />
              Gallery Context
              {contextExpanded ? (
                <ChevronUp className="h-3 w-3 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              )}
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsEditingContext(true);
                setContextDraft(aiContext);
              }}
            >
              <Pencil className="mr-1 h-3 w-3" />
              Edit
            </Button>
          </div>
          {contextExpanded && (
            <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
              {aiContext}
            </p>
          )}
        </div>
      )}

      {/* Context editing inline */}
      {isEditingContext && (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <BrainCircuit className="h-4 w-4 text-primary" />
            Edit Gallery Context
          </div>
          <textarea
            className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            placeholder="e.g. Wedding session for Sarah & John. Outdoor ceremony, indoor reception."
            value={contextDraft}
            onChange={(e) => setContextDraft(e.target.value)}
          />
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsEditingContext(false);
                setContextDraft(aiContext ?? "");
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => void handleSaveContext()}
              disabled={isSavingContext}
            >
              {isSavingContext && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </div>
        </div>
      )}

      {/* No context banner (for skipped state) */}
      {!aiContext && !isEditingContext && (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BrainCircuit className="h-4 w-4" />
              No gallery context set. Adding context improves search accuracy.
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingContext(true)}
            >
              <Pencil className="mr-1 h-3 w-3" />
              Add Context
            </Button>
          </div>
        </div>
      )}

      {/* Search / Album generation UI */}
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
                Describe the album you want to create (e.g., &quot;I want all photos that are outdoor&quot;), and our AI will select the
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
