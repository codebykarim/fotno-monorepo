"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { apiRequest } from "@/lib/api/client";

import { SourceSelector, type ImportSource } from "./source-selector";
import { ImportStepper } from "./import-stepper";
import { ConnectBanner } from "./connect-banner";
import { GdrivePicker, type PickedDriveFile } from "./gdrive-picker";
import { GdriveReviewGrid } from "./gdrive-review-grid";
import { GphotosPicker, type PickedPhoto } from "./gphotos-picker";
import { GphotosReviewGrid } from "./gphotos-review-grid";
import { ImportConfig, type FolderMapping } from "./import-config";
import { ImportProgress } from "./import-progress";

const GDRIVE_STEPS = [
  { label: "Pick Files" },
  { label: "Review" },
  { label: "Configure" },
  { label: "Progress" },
];

const GPHOTOS_STEPS = [
  { label: "Pick Photos" },
  { label: "Review" },
  { label: "Configure" },
  { label: "Progress" },
];

export function ImportPage() {
  const searchParams = useSearchParams();
  const initialSource = searchParams.get("source") as ImportSource | null;
  const initialJobId = searchParams.get("jobId");

  const [source, setSource] = useState<ImportSource | null>(
    initialSource === "gphotos" || initialSource === "gdrive"
      ? initialSource
      : initialJobId
        ? "gdrive"
        : null,
  );
  const [step, setStep] = useState(initialJobId ? 3 : 0);

  // Google Drive state
  const [pickedFiles, setPickedFiles] = useState<PickedDriveFile[]>([]);

  // Google Photos state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pickedPhotos, setPickedPhotos] = useState<PickedPhoto[]>([]);
  const [picking, setPicking] = useState(false);

  // Shared state
  const [importing, setImporting] = useState(false);
  const [jobId, setJobId] = useState<string | null>(initialJobId);

  function handleSelectSource(s: ImportSource) {
    setSource(s);
    setStep(0);
  }

  function handleBackToSources() {
    setSource(null);
    setStep(0);
    setPickedFiles([]);
    setPickedPhotos([]);
    setSessionId(null);
    setJobId(null);
  }

  // Google Drive: files picked
  const handleDriveFilesReady = useCallback((files: PickedDriveFile[]) => {
    setPickedFiles(files);
    setStep(1); // review step
  }, []);

  // Google Drive: start import
  async function handleGdriveImport(mappings: FolderMapping[]) {
    setImporting(true);
    try {
      const mapping = mappings[0];
      if (!mapping) throw new Error("No gallery configured");

      const result = await apiRequest<{ jobId: string; totalFiles: number }>(
        "/api/gdrive/import",
        {
          method: "POST",
          body: JSON.stringify({
            files: pickedFiles.map((f) => ({
              id: f.id,
              name: f.name,
              mimeType: f.mimeType,
              sizeBytes: f.sizeBytes,
            })),
            galleryId: mapping.galleryId,
            newGallery: mapping.newGallery,
          }),
        },
      );
      setJobId(result.jobId);
      setStep(3); // progress step
      toast.success(`Import started: ${result.totalFiles} files`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to start import",
      );
    } finally {
      setImporting(false);
    }
  }

  // Google Photos: start import
  async function handleGphotosImport(mappings: FolderMapping[]) {
    if (!sessionId) return;
    setImporting(true);
    try {
      const mapping = mappings[0];
      if (!mapping) throw new Error("No gallery configured");

      const result = await apiRequest<{ jobId: string; totalFiles: number }>(
        "/api/gphotos/import",
        {
          method: "POST",
          body: JSON.stringify({
            sessionId,
            galleryId: mapping.galleryId,
            newGallery: mapping.newGallery,
          }),
        },
      );
      setJobId(result.jobId);
      setStep(3); // progress step
      toast.success(`Import started: ${result.totalFiles} photos`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to start import",
      );
    } finally {
      setImporting(false);
    }
  }

  const handlePhotosReady = useCallback((photos: PickedPhoto[]) => {
    setPickedPhotos(photos);
    setStep(1); // review step
  }, []);

  function handleImportMore() {
    setJobId(null);
    setStep(0);
    setPickedFiles([]);
    setPickedPhotos([]);
    setSessionId(null);
  }

  const steps = source === "gdrive" ? GDRIVE_STEPS : GPHOTOS_STEPS;
  const isProgressStep = step === 3;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/galleries">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Import Photos
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {source
              ? source === "gdrive"
                ? "Select photos from your Google Drive and import them into a gallery."
                : "Pick photos from Google Photos and import them into a gallery."
              : "Choose a source to import photos from."}
          </p>
        </div>
      </div>

      {/* Source selection */}
      {!source && <SourceSelector onSelect={handleSelectSource} />}

      {/* Active flow */}
      {source && (
        <div className="space-y-6">
          {/* Stepper + back to sources */}
          <div className="flex items-center gap-4">
            <ImportStepper steps={steps} currentStep={step} />
          </div>

          {/* Connect banner */}
          {!isProgressStep && <ConnectBanner source={source} />}

          {/* =================== GOOGLE DRIVE FLOW =================== */}
          {source === "gdrive" && (
            <>
              {/* Step 0: Pick Files */}
              {step === 0 && (
                <GdrivePicker onFilesReady={handleDriveFilesReady} />
              )}

              {/* Step 1: Review */}
              {step === 1 && pickedFiles.length > 0 && (
                <div className="space-y-4">
                  <GdriveReviewGrid
                    files={pickedFiles}
                    onPickAgain={() => setStep(0)}
                  />
                  <div className="flex justify-end">
                    <Button onClick={() => setStep(2)}>
                      Continue to Import
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Configure */}
              {step === 2 && (
                <div className="space-y-4">
                  <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back to review
                  </Button>
                  <ImportConfig
                    items={[
                      {
                        id: "drive-picker",
                        name: `Google Drive (${pickedFiles.length} files)`,
                      },
                    ]}
                    onStartImport={handleGdriveImport}
                    importing={importing}
                  />
                </div>
              )}

              {/* Step 3: Progress */}
              {step === 3 && jobId && (
                <div className="space-y-4">
                  <ImportProgress jobId={jobId} />
                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <Link href="/galleries">Back to Galleries</Link>
                    </Button>
                    <Button variant="outline" onClick={handleImportMore}>
                      Import More
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* =================== GOOGLE PHOTOS FLOW =================== */}
          {source === "gphotos" && (
            <>
              {/* Step 0: Pick Photos */}
              {step === 0 && (
                <GphotosPicker
                  picking={picking}
                  onPickingChange={setPicking}
                  onPhotosReady={handlePhotosReady}
                  onSessionId={setSessionId}
                />
              )}

              {/* Step 1: Review Selection */}
              {step === 1 && pickedPhotos.length > 0 && (
                <div className="space-y-4">
                  <GphotosReviewGrid
                    photos={pickedPhotos}
                    onPickAgain={() => setStep(0)}
                  />
                  <div className="flex justify-end">
                    <Button onClick={() => setStep(2)}>
                      Continue to Import
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Configure */}
              {step === 2 && (
                <div className="space-y-4">
                  <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back to review
                  </Button>
                  <ImportConfig
                    items={[
                      {
                        id: sessionId ?? "",
                        name: `Google Photos (${pickedPhotos.length} photos)`,
                      },
                    ]}
                    onStartImport={handleGphotosImport}
                    importing={importing}
                  />
                </div>
              )}

              {/* Step 3: Progress */}
              {step === 3 && jobId && (
                <div className="space-y-4">
                  <ImportProgress jobId={jobId} />
                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <Link href="/galleries">Back to Galleries</Link>
                    </Button>
                    <Button variant="outline" onClick={handleImportMore}>
                      Import More
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
