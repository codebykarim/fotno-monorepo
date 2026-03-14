"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  SkipForward,
  ChevronDown,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Progress } from "@workspace/ui/components/progress";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { apiRequest, jsonFetcher } from "@/lib/api/client";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";

interface ImportItem {
  id: string;
  galleryId: string;
  folderName: string;
  fileName: string | null;
  fileSize: string;
  status: string;
  errorMessage: string | null;
}

interface ImportJobData {
  id: string;
  status: string;
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  skippedFiles: number;
  errorMessage: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  items: ImportItem[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  LISTING: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  IN_PROGRESS:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  COMPLETED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  CANCELLED:
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

export function ImportProgress({ jobId }: { jobId: string }) {
  const [showItems, setShowItems] = useState(false);

  const isActive = (status?: string) =>
    status !== "COMPLETED" && status !== "FAILED" && status !== "CANCELLED";

  const { data, mutate } = useSWR<ImportJobData>(
    `/api/gdrive/import/${jobId}`,
    jsonFetcher,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { refreshInterval: 3000, revalidateOnFocus: true } as any,
  );

  async function handleCancel() {
    try {
      await apiRequest(`/api/gdrive/import/${jobId}/cancel`, {
        method: "POST",
      });
      toast.success("Import cancelled");
      await mutate();
    } catch {
      toast.error("Failed to cancel import");
    }
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const processed = data.completedFiles + data.failedFiles + data.skippedFiles;
  const progress =
    data.totalFiles > 0 ? Math.round((processed / data.totalFiles) * 100) : 0;
  const jobIsActive = isActive(data.status);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Import Progress</CardTitle>
          <Badge className={STATUS_COLORS[data.status] ?? ""}>
            {data.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {processed} of {data.totalFiles} files
            </span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-4 gap-3 text-center text-sm">
          <div>
            <p className="text-lg font-semibold">{data.totalFiles}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-green-600">
              {data.completedFiles}
            </p>
            <p className="text-xs text-muted-foreground">Imported</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-red-600">
              {data.failedFiles}
            </p>
            <p className="text-xs text-muted-foreground">Failed</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-yellow-600">
              {data.skippedFiles}
            </p>
            <p className="text-xs text-muted-foreground">Skipped</p>
          </div>
        </div>

        {data.errorMessage && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-300">
            {data.errorMessage}
          </div>
        )}

        {jobIsActive && (
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancel Import
          </Button>
        )}

        {data.items.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowItems(!showItems)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  showItems && "rotate-180",
                )}
              />
              {showItems ? "Hide" : "Show"} file details
            </button>

            {showItems && (
              <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border divide-y text-sm">
                {data.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 px-3 py-2"
                  >
                    {item.status === "COMPLETED" ||
                    item.status === "PROCESSING" ||
                    item.status === "UPLOADED" ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                    ) : item.status === "FAILED" ? (
                      <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                    ) : item.status === "SKIPPED" ? (
                      <SkipForward className="h-4 w-4 shrink-0 text-yellow-500" />
                    ) : item.status === "DOWNLOADING" ? (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-blue-500" />
                    ) : (
                      <div className="h-4 w-4 shrink-0 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    <span className="flex-1 truncate">
                      {item.fileName ?? "Unknown"}
                    </span>
                    {item.errorMessage && (
                      <span
                        className="text-xs text-red-500 truncate max-w-40"
                        title={item.errorMessage}
                      >
                        {item.errorMessage}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
