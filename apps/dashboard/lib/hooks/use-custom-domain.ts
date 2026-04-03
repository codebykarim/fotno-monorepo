"use client";

import useSWR from "swr";
import { jsonFetcher } from "@/lib/api/client";

type CustomDomainData = {
  domain: string;
  status: "PENDING" | "VERIFIED" | "FAILED";
} | null;

export function useCustomDomain() {
  const { data } = useSWR<{ data: CustomDomainData }>(
    "/api/settings/domain",
    jsonFetcher,
    { revalidateOnFocus: false },
  );

  const domain = data?.data;
  const verifiedDomain =
    domain?.status === "VERIFIED" ? domain.domain : null;

  return { verifiedDomain };
}
