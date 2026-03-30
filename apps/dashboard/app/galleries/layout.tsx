"use client";

import { useRouter } from "next/navigation";
import { ImportHistoryDialog } from "@/components/dashboard/import/import-history-dialog";

export default function GalleriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  function handleViewJob(jobId: string) {
    router.push(`/galleries/import?jobId=${jobId}`);
  }

  return (
    <>
      {children}
      <div className="fixed bottom-6 right-6 z-50">
        <ImportHistoryDialog onViewJob={handleViewJob} />
      </div>
    </>
  );
}
