"use client";

import { FileImage } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import type { PickedDriveFile } from "./gdrive-picker";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / k ** i).toFixed(1)} ${sizes[i]}`;
}

export function GdriveReviewGrid({
  files,
  onPickAgain,
}: {
  files: PickedDriveFile[];
  onPickAgain: () => void;
}) {
  const totalSize = files.reduce((sum, f) => sum + f.sizeBytes, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {files.length} file{files.length !== 1 ? "s" : ""} selected
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({formatBytes(totalSize)})
            </span>
          </CardTitle>
          <button
            type="button"
            onClick={onPickAgain}
            className="text-sm text-primary hover:underline"
          >
            Pick Again
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-80 overflow-y-auto divide-y rounded-lg border text-sm">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2.5 px-3 py-2"
            >
              <FileImage className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate">{file.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatBytes(file.sizeBytes)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
