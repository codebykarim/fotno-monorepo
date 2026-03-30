"use client";

import { redirect, usePathname, useRouter } from "next/navigation";
import { ImportHistoryDialog } from "@/components/dashboard/import/import-history-dialog";
import { useState } from "react";

export default function GalleriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [closeDialog, setCloseDialog] = useState(false);

  if (pathname !== "/galleries/import") {
    return children;
  }

  function handleViewJob(jobId: string) {
    setCloseDialog(false);
    // redirect(`/galleries/import?jobId=${jobId}`);
    window.location.href = `/galleries/import?jobId=${jobId}`;
  }

  return (
    <>
      {children}
      <div className="fixed top-6 right-6 z-50">
        <ImportHistoryDialog
          onViewJob={handleViewJob}
          closeDialog={closeDialog}
          setCloseDialog={setCloseDialog}
        />
      </div>
    </>
  );
}
