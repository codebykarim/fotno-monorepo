"use client";

import useSWR from "swr";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Ban,
  History,
} from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { jsonFetcher } from "@/lib/api/client";
import { Dispatch, SetStateAction } from "react";

interface ImportSummary {
  id: string;
  status: string;
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  skippedFiles: number;
  createdAt: string;
  completedAt: string | null;
}

interface ImportsResponse {
  imports: ImportSummary[];
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  COMPLETED: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  FAILED: <XCircle className="h-4 w-4 text-red-500" />,
  CANCELLED: <Ban className="h-4 w-4 text-gray-500" />,
  IN_PROGRESS: <Loader2 className="h-4 w-4 animate-spin text-blue-500" />,
  PENDING: <Clock className="h-4 w-4 text-yellow-500" />,
  LISTING: <Loader2 className="h-4 w-4 animate-spin text-blue-500" />,
};

const STATUS_LABEL: Record<string, string> = {
  COMPLETED: "Completed",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
  IN_PROGRESS: "In Progress",
  PENDING: "Pending",
  LISTING: "Listing Files",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function ImportHistoryDialog({
  onViewJob,
  closeDialog,
  setCloseDialog,
}: {
  onViewJob: (jobId: string) => void;
  closeDialog: boolean;
  setCloseDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const { data, isLoading } = useSWR<ImportsResponse>(
    "/api/gdrive/imports",
    jsonFetcher,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { refreshInterval: 30000, revalidateOnFocus: true } as any,
  );

  const imports = data?.imports ?? [];

  return (
    <Dialog open={closeDialog} onOpenChange={setCloseDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <History className="h-3.5 w-3.5" />
          Past Imports
          {imports.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
              {imports.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import History</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && imports.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No imports yet
          </p>
        )}

        {imports.length > 0 && (
          <div className="max-h-80 overflow-y-auto divide-y rounded-lg border">
            {imports.map((job) => {
              const isActive =
                job.status === "IN_PROGRESS" ||
                job.status === "PENDING" ||
                job.status === "LISTING";

              return (
                <div key={job.id} className="flex items-center gap-3 px-4 py-3">
                  {STATUS_ICON[job.status] ?? (
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {job.totalFiles} file
                        {job.totalFiles !== 1 ? "s" : ""}
                      </span>
                      <Badge
                        variant="outline"
                        className="px-1.5 py-0 text-[10px]"
                      >
                        {STATUS_LABEL[job.status] ?? job.status}
                      </Badge>
                    </div>
                    <div className="mt-0.5 flex gap-3 text-xs text-muted-foreground">
                      <span>{timeAgo(job.createdAt)}</span>
                      {job.completedFiles > 0 && (
                        <span className="text-green-600">
                          {job.completedFiles} imported
                        </span>
                      )}
                      {job.failedFiles > 0 && (
                        <span className="text-red-600">
                          {job.failedFiles} failed
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 text-xs"
                    onClick={() => onViewJob(job.id)}
                  >
                    {isActive ? "View Progress" : "Details"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
