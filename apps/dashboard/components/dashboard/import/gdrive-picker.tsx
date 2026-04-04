"use client";

import { useState } from "react";
import { HardDrive, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { apiRequest } from "@/lib/api/client";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PICKER_API_KEY ?? "";
const GOOGLE_APP_ID = process.env.NEXT_PUBLIC_GOOGLE_APP_ID ?? "";

export interface PickedDriveFile {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
}

declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
    };
    google: {
      picker: {
        PickerBuilder: new () => {
          setOAuthToken: (token: string) => any;
          setDeveloperKey: (key: string) => any;
          setAppId: (id: string) => any;
          addView: (view: any) => any;
          enableFeature: (feature: any) => any;
          setCallback: (cb: (data: any) => void) => any;
          build: () => { setVisible: (visible: boolean) => void };
        };
        DocsView: new (viewId?: string) => {
          setIncludeFolders: (include: boolean) => any;
          setMimeTypes: (types: string) => any;
        };
        ViewId: { DOCS: string; DOCS_IMAGES: string };
        Feature: { MULTISELECT_ENABLED: string };
        Action: { PICKED: string; CANCEL: string };
      };
    };
  }
}

function loadPickerApi(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.picker) {
      resolve();
      return;
    }

    const existing = document.querySelector(
      'script[src="https://apis.google.com/js/api.js"]',
    );
    if (existing) {
      // Script loaded but picker not yet ready — wait for gapi
      const wait = () => {
        if (window.gapi) {
          window.gapi.load("picker", () => resolve());
        } else {
          setTimeout(wait, 50);
        }
      };
      wait();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      window.gapi.load("picker", () => resolve());
    };
    script.onerror = () => reject(new Error("Failed to load Google API"));
    document.head.appendChild(script);
  });
}

export function GdrivePicker({
  onFilesReady,
}: {
  onFilesReady: (files: PickedDriveFile[]) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleOpenPicker() {
    setLoading(true);
    try {
      await loadPickerApi();

      const { accessToken } = await apiRequest<{ accessToken: string }>(
        "/api/gdrive/access-token",
      );

      const view = new window.google.picker.DocsView();
      view.setIncludeFolders(true);
      view.setMimeTypes(
        "image/jpeg,image/png,image/webp,image/gif,image/tiff,image/bmp,image/heic,image/heif",
      );

      const picker = new window.google.picker.PickerBuilder()
        .setOAuthToken(accessToken)
        .setDeveloperKey(GOOGLE_API_KEY)
        .setAppId(GOOGLE_APP_ID)
        .addView(view)
        .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
        .setCallback((data: any) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const files: PickedDriveFile[] = data.docs.map((doc: any) => ({
              id: doc.id,
              name: doc.name,
              mimeType: doc.mimeType,
              sizeBytes: doc.sizeBytes || 0,
            }));
            onFilesReady(files);
          }
        })
        .build();

      picker.setVisible(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to open file picker",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12">
      <HardDrive className="h-12 w-12 text-muted-foreground" />
      <div className="text-center">
        <p className="text-sm font-medium">Select images from Google Drive</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Navigate to a folder, then press{" "}
          <kbd className="rounded border bg-muted px-1 py-0.5 text-[10px] font-mono">
            {typeof navigator !== "undefined" &&
            /Mac|iPhone/.test(navigator.userAgent)
              ? "\u2318"
              : "Ctrl"}
            +A
          </kbd>{" "}
          to select all images
        </p>
      </div>
      <Button onClick={handleOpenPicker} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            Opening picker...
          </>
        ) : (
          "Open Google Drive Picker"
        )}
      </Button>
    </div>
  );
}
