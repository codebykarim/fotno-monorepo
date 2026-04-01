"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { SubmissionReview } from "@/components/smart-albums/submission-review";
import { ArrowLeft } from "lucide-react";

export default function GallerySubmissionDetailPage() {
  const { id: galleryId, submissionId } = useParams<{ id: string; submissionId: string }>();
  const router = useRouter();
  const [submission, setSubmission] = useState<any>(null);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!submissionId) return;

    const load = async () => {
      try {
        const res = await fetch(`/api/smart-albums/submissions/${submissionId}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load submission");
        }
        const data = await res.json();
        setSubmission(data);
        setPhotoUrls(data.photoUrls || {});
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [submissionId]);

  const backUrl = `/galleries/${galleryId}/smart-albums`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(backUrl)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Smart Albums
        </Button>
      </div>

      {loading && <div className="text-sm text-muted-foreground">Loading submission...</div>}
      {error && <div className="text-sm text-destructive">{error}</div>}

      {!loading && !error && submission && (
        <>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Submission from {submission.clientName}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">{submission.galleryTitle}</p>
          </div>

          <SubmissionReview
            submission={submission}
            photoUrls={photoUrls}
            onReviewComplete={() => {
              if (!submissionId) return;
              fetch(`/api/smart-albums/submissions/${submissionId}`)
                .then((r) => r.json())
                .then((data) => {
                  setSubmission(data);
                  setPhotoUrls(data.photoUrls || {});
                })
                .catch(() => {});
            }}
          />
        </>
      )}
    </div>
  );
}
