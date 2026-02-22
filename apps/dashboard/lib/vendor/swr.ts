"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Fetcher<T> = (key: string) => Promise<T>;

type SWROptions = {
  revalidateOnFocus?: boolean;
};

type SWRResult<T> = {
  data: T | undefined;
  error: unknown;
  isLoading: boolean;
  mutate: (updater?: T | Promise<T> | ((current?: T) => T | Promise<T>)) => Promise<T | undefined>;
};

const cache = new Map<string, unknown>();

async function defaultFetcher<T>(key: string) {
  const response = await fetch(key);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${key}`);
  }
  return (await response.json()) as T;
}

export default function useSWR<T>(
  key: string | null,
  fetcher?: Fetcher<T>,
  options?: SWROptions
): SWRResult<T> {
  const [data, setData] = useState<T | undefined>(() => {
    if (!key) {
      return undefined;
    }
    return cache.get(key) as T | undefined;
  });
  const [error, setError] = useState<unknown>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(key && !cache.has(key)));

  const doFetch = useCallback(async () => {
    if (!key) {
      return undefined;
    }

    setIsLoading(true);
    setError(undefined);
    try {
      const resolvedFetcher = fetcher ?? ((k: string) => defaultFetcher<T>(k));
      const next = await resolvedFetcher(key);
      cache.set(key, next);
      setData(next);
      return next;
    } catch (err) {
      setError(err);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, key]);

  useEffect(() => {
    void doFetch();
  }, [doFetch]);

  useEffect(() => {
    if (!key || options?.revalidateOnFocus === false) {
      return;
    }

    const onFocus = () => {
      void doFetch();
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [doFetch, key, options?.revalidateOnFocus]);

  const mutate = useCallback(
    async (updater?: T | Promise<T> | ((current?: T) => T | Promise<T>)) => {
      if (!key) {
        return undefined;
      }

      if (updater === undefined) {
        return doFetch();
      }

      const next =
        typeof updater === "function"
          ? await (updater as (current?: T) => T | Promise<T>)(data)
          : await updater;

      cache.set(key, next);
      setData(next);
      return next;
    },
    [data, doFetch, key]
  );

  return useMemo(
    () => ({
      data,
      error,
      isLoading,
      mutate,
    }),
    [data, error, isLoading, mutate]
  );
}
