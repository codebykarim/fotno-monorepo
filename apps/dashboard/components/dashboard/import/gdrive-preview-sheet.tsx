"use client";

import useSWR from "swr";
import { FileImage, ImageIcon } from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@workspace/ui/components/sheet";
import { jsonFetcher } from "@/lib/api/client";

interface PreviewFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
}

interface PreviewData {
  folderId: string;
  fileCount: number;
  totalSize: number;
  sampleThumbnails: string[];
  files: PreviewFile[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / k ** i).toFixed(1)} ${sizes[i]}`;
}

export function GdrivePreviewSheet({
  folderId,
  onClose,
}: {
  folderId: string | null;
  onClose: () => void;
}) {
  const { data, isLoading } = useSWR<PreviewData>(
    folderId ? `/api/gdrive/folders/${folderId}/preview` : null,
    jsonFetcher,
    { revalidateOnFocus: false },
  );

  return (
    <Sheet open={!!folderId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Folder Preview</SheetTitle>
          <SheetDescription>
            {data
              ? `${data.fileCount} photo${data.fileCount !== 1 ? "s" : ""} \u00B7 ${formatBytes(data.totalSize)}`
              : "Loading..."}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {isLoading && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded" />
                ))}
              </div>
              <Skeleton className="h-4 w-24" />
            </div>
          )}

          {data && (
            <>
              {/* Thumbnail grid */}
              {data.sampleThumbnails.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {data.sampleThumbnails.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="aspect-square rounded-md bg-muted object-cover"
                    />
                  ))}
                </div>
              )}

              {/* File list */}
              {data.files.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    Files
                  </p>
                  <div className="max-h-64 overflow-y-auto divide-y rounded-lg border text-xs">
                    {data.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-2 px-2.5 py-1.5"
                      >
                        <FileImage className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="flex-1 truncate">{file.name}</span>
                        <span className="shrink-0 text-muted-foreground">
                          {formatBytes(file.size)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.fileCount === 0 && (
                <div className="flex flex-col items-center gap-2 py-8 text-sm text-muted-foreground">
                  <ImageIcon className="h-8 w-8" />
                  <span>No image files in this folder</span>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
