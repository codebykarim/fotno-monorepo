"use client";

import { Suspense } from "react";
import { ImportPage } from "@/components/dashboard/import/import-page";
import { useHasFeature } from "@/lib/hooks/use-features";
import { LockedPage } from "@/components/dashboard/feature-gate";

function ImportGuard() {
  const hasImport = useHasFeature("GOOGLE_IMPORT");

  if (!hasImport) {
    return (
      <LockedPage
        featureKey="GOOGLE_IMPORT"
        title="Import Photos"
        description="Import photos directly from Google Drive or Google Photos into your galleries."
      />
    );
  }

  return <ImportPage />;
}

export default function ImportPageRoute() {
  return (
    <Suspense>
      <ImportGuard />
    </Suspense>
  );
}
