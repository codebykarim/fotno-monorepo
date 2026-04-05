import useSWR from "swr";
import { jsonFetcher } from "@/lib/api/client";
import type { SubscriptionResponse } from "@/lib/types/api";

/**
 * Returns the list of feature keys available to the current user's plan.
 * Data is fetched once and cached via SWR (same key as billing page).
 */
export function useFeatures(): string[] {
  const { data } = useSWR<SubscriptionResponse>(
    "/api/billing/subscription",
    jsonFetcher,
    { revalidateOnFocus: false },
  );
  return data?.access.features ?? [];
}

/**
 * Returns features + loading state for guards that need to distinguish
 * "still loading" from "no features".
 */
export function useFeaturesLoaded(): { features: string[]; isLoaded: boolean } {
  const { data } = useSWR<SubscriptionResponse>(
    "/api/billing/subscription",
    jsonFetcher,
    { revalidateOnFocus: false },
  );
  return {
    features: data?.access.features ?? [],
    isLoaded: data !== undefined,
  };
}

/**
 * Check if the current user's plan includes a specific feature.
 */
export function useHasFeature(key: string): boolean {
  const features = useFeatures();
  return features.includes(key);
}
