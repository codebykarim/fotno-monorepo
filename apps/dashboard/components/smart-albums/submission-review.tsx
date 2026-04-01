"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { CheckCircle2, Clock, XCircle, RotateCcw } from "lucide-react";
import { AlbumPreviewViewer } from "./album-preview-viewer";
import type { SubmissionDetail } from "@/lib/types/smart-album";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  CHANGES_REQUESTED: "bg-orange-100 text-orange-800",
  REJECTED: "bg-red-100 text-red-800",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] || "bg-gray-100 text-gray-800"}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

interface SubmissionReviewProps {
  submission: SubmissionDetail;
  photoUrls: Record<string, string>;
  onReviewComplete?: () => void;
}

export function SubmissionReview({
  submission,
  photoUrls,
  onReviewComplete,
}: SubmissionReviewProps) {
  const [action, setAction] = useState<"approve" | "request_changes" | "reject" | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(
    submission.exportReady ? submission.exportUrl ?? null : null,
  );
  const [error, setError] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState(false);

  const isPending = submission.status === "PENDING" && !reviewed;

  const handleReview = async () => {
    if (!action) return;
    if ((action === "request_changes" || action === "reject") && !notes.trim()) {
      setError(action === "request_changes" ? "Please describe the changes needed." : "Please provide a reason for rejection.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/smart-albums/submissions/${submission.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          notes: notes.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }
      setReviewed(true);
      onReviewComplete?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExport = async (force = false) => {
    setExporting(true);
    setError(null);
    try {
      const url = `/api/smart-albums/submissions/${submission.id}/export${force ? "?force=true" : ""}`;
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate export");
      }
      const data = await res.json();
      setExportUrl(data.exportUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Client</p>
          <p className="font-medium text-sm">{submission.clientName}</p>
          <p className="text-xs text-muted-foreground">{submission.clientEmail}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Gallery</p>
          <p className="font-medium text-sm">{submission.galleryTitle}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Product</p>
          <p className="font-medium text-sm">{submission.productName}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Submitted</p>
          <p className="font-medium text-sm">
            {new Date(submission.submittedAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-muted-foreground">Version {submission.version}</p>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3">
        <StatusBadge status={submission.status} />
        {submission.photographerNotes && (
          <p className="text-sm text-muted-foreground italic">
            &ldquo;{submission.photographerNotes}&rdquo;
          </p>
        )}
      </div>

      {/* Payment Info */}
      {submission.transactionId && (
        <div className="border rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Payment</h2>
            {submission.transactionStatus === "SUCCEEDED" && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Paid
              </Badge>
            )}
            {submission.transactionStatus === "PENDING" && (
              <Badge variant="secondary">
                <Clock className="mr-1 h-3 w-3" />
                Pending
              </Badge>
            )}
            {submission.transactionStatus === "FAILED" && (
              <Badge variant="destructive">
                <XCircle className="mr-1 h-3 w-3" />
                Failed
              </Badge>
            )}
            {submission.transactionStatus === "REFUNDED" && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                <RotateCcw className="mr-1 h-3 w-3" />
                Refunded
              </Badge>
            )}
          </div>

          {submission.transactionAmountCents != null && submission.transactionCurrency && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Total</p>
                <p className="font-medium">
                  {(submission.transactionAmountCents / 100).toLocaleString("en-US", {
                    style: "currency",
                    currency: submission.transactionCurrency,
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Platform fee</p>
                <p className="font-medium text-muted-foreground">
                  -{(submission.transactionFeeCents! / 100).toLocaleString("en-US", {
                    style: "currency",
                    currency: submission.transactionCurrency,
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">You receive</p>
                <p className="font-semibold text-green-600">
                  {(submission.transactionNetCents! / 100).toLocaleString("en-US", {
                    style: "currency",
                    currency: submission.transactionCurrency,
                  })}
                </p>
              </div>
              {submission.transactionPaidAt && (
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Paid at</p>
                  <p className="font-medium">
                    {new Date(submission.transactionPaidAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Album Preview */}
      <div>
        <h2 className="text-base font-semibold mb-4">Album Preview</h2>
        <AlbumPreviewViewer
          designSnapshot={submission.designSnapshot}
          photoUrls={photoUrls}
          widthCm={submission.productWidthCm}
          heightCm={submission.productHeightCm}
        />
      </div>

      {/* Review Actions */}
      {isPending && (
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-base font-semibold">Review Decision</h2>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={action === "approve" ? "default" : "outline"}
              onClick={() => setAction("approve")}
            >
              Approve
            </Button>
            <Button
              variant={action === "request_changes" ? "default" : "outline"}
              onClick={() => setAction("request_changes")}
            >
              Request Changes
            </Button>
            <Button
              variant={action === "reject" ? "destructive" : "outline"}
              onClick={() => setAction("reject")}
            >
              Reject
            </Button>
          </div>

          {(action === "request_changes" || action === "reject") && (
            <textarea
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder={
                action === "request_changes"
                  ? "Describe the changes needed..."
                  : "Reason for rejection..."
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          {action && (
            <Button onClick={handleReview} disabled={submitting}>
              {submitting ? "Submitting..." : "Confirm Decision"}
            </Button>
          )}
        </div>
      )}

      {reviewed && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-800 font-medium">Review submitted successfully.</p>
        </div>
      )}

      {/* Export (only for approved) */}
      {(submission.status === "APPROVED" || (reviewed && action === "approve")) && (
        <div className="border rounded-lg p-6">
          <h2 className="text-base font-semibold mb-3">Export for Print</h2>
          {error && <p className="text-sm text-destructive mb-2">{error}</p>}
          {exportUrl ? (
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" asChild>
                <a href={exportUrl} download>
                  Download Export ZIP
                </a>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExport(true)}
                disabled={exporting}
              >
                {exporting ? "Regenerating..." : "Regenerate Export"}
              </Button>
            </div>
          ) : (
            <Button onClick={() => handleExport(false)} disabled={exporting}>
              {exporting ? "Generating export..." : "Generate & Download Export"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
