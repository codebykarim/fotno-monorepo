"use client";

import { useCallback, useEffect, useRef } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { apiRequest } from "@/lib/api/client";

export interface PickedPhoto {
  id: string;
  filename: string;
  mimeType: string;
  baseUrl: string;
}

export function GphotosPicker({
  picking,
  onPickingChange,
  onPhotosReady,
  onSessionId,
}: {
  picking: boolean;
  onPickingChange: (picking: boolean) => void;
  onPhotosReady: (photos: PickedPhoto[]) => void;
  onSessionId: (sessionId: string) => void;
}) {
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  async function fetchPickedItems(sid: string) {
    try {
      const result = await apiRequest<{
        photos: PickedPhoto[];
        totalCount: number;
      }>(`/api/gphotos/session/${sid}/items`);
      onPhotosReady(result.photos);
    } catch {
      toast.error("Failed to load selected photos");
      onPickingChange(false);
    }
  }

  async function handleSelectPhotos() {
    onPickingChange(true);
    try {
      const session = await apiRequest<{
        sessionId: string;
        pickerUri: string;
        pollingConfig: { pollInterval: string; timeoutIn: string };
      }>("/api/gphotos/session", { method: "POST" });

      const sid = session.sessionId;
      onSessionId(sid);

      const pickerUrl = `${session.pickerUri}/autoclose`;
      const pickerWindow = window.open(
        pickerUrl,
        "gphotos-picker",
        "width=900,height=700",
      );

      const intervalStr = session.pollingConfig.pollInterval ?? "5s";
      const intervalMs =
        parseFloat(intervalStr.replace("s", "")) * 1000 || 5000;

      let windowClosedAt: number | null = null;

      pollingRef.current = setInterval(async () => {
        try {
          const status = await apiRequest<{
            mediaItemsSet: boolean;
          }>(`/api/gphotos/session/${sid}`);

          if (status.mediaItemsSet) {
            stopPolling();
            onPickingChange(false);
            toast.success("Photos selected!");
            fetchPickedItems(sid);
            return;
          }

          if (pickerWindow && pickerWindow.closed) {
            if (!windowClosedAt) {
              windowClosedAt = Date.now();
            } else if (Date.now() - windowClosedAt > 15_000) {
              stopPolling();
              onPickingChange(false);
              toast.info("Photo selection was cancelled");
            }
          }
        } catch {
          // Silently retry
        }
      }, intervalMs);

      const timeoutStr = session.pollingConfig.timeoutIn ?? "1800s";
      const timeoutMs =
        parseFloat(timeoutStr.replace("s", "")) * 1000 || 1800000;

      setTimeout(() => {
        if (pollingRef.current) {
          stopPolling();
          onPickingChange(false);
          toast.error("Photo selection timed out. Please try again.");
        }
      }, timeoutMs);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to open Google Photos picker",
      );
      onPickingChange(false);
    }
  }

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <ImageIcon className="h-7 w-7 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-medium">Select Photos</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Open the Google Photos picker to choose which photos you want to
            import. You can select individual photos or entire albums.
          </p>
        </div>
        <Button onClick={handleSelectPhotos} disabled={picking} size="lg">
          {picking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Waiting for selection...
            </>
          ) : (
            "Open Google Photos Picker"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
