import { Suspense } from "react";
import { ImportPage } from "@/components/dashboard/import/import-page";

export default function ImportPageRoute() {
  return (
    <Suspense>
      <ImportPage />
    </Suspense>
  );
}
