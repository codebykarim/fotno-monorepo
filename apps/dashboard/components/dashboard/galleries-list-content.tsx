"use client";

import { useMemo, useState } from "react";
import useSWR, { mutate as mutateCache } from "swr";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpDown, Download, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { apiRequest, jsonFetcher } from "@/lib/api/client";
import { ListGalleriesResponse } from "@/lib/types/api";
import { GalleryCard } from "@/components/dashboard/gallery-card";
import { GalleryCardSkeleton } from "@/components/dashboard/gallery-card-skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

const STATUS_OPTIONS = ["all", "draft", "published"] as const;
type StatusFilter = (typeof STATUS_OPTIONS)[number];

const SORT_LABELS: Record<string, string> = {
  newest: "Newest",
  oldest: "Oldest",
  title_asc: "A \u2192 Z",
  title_desc: "Z \u2192 A",
};

export function GalleriesListContent() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<
    "newest" | "oldest" | "title_asc" | "title_desc"
  >("newest");

  const key = useMemo(() => {
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set("q", query.trim());
    }
    params.set("status", status);
    params.set("sort", sort);
    return `/api/galleries?${params.toString()}`;
  }, [query, sort, status]);

  const { data, isLoading, mutate } = useSWR<ListGalleriesResponse>(
    key,
    jsonFetcher,
  );

  async function handleDelete(id: string) {
    try {
      await apiRequest<{ success: boolean }>(`/api/galleries/${id}`, {
        method: "DELETE",
      });
      await Promise.all([
        mutateCache("/api/storage/summary"),
        mutateCache("/api/storage/events?limit=10&offset=0"),
      ]);
      toast.success("Gallery deleted");
      await mutate();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete gallery",
      );
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={fadeInUp.transition}
      >
        <div>
          <h1 className="dashboard-title text-2xl font-semibold tracking-tight">
            Galleries
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage and deliver your photo galleries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/galleries/import">
              <Download className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Import Photos</span>
              <span className="sm:hidden">Import</span>
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/galleries/new">
              <Plus className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">New Gallery</span>
              <span className="sm:hidden">New</span>
            </Link>
          </Button>
        </div>
      </motion.div>

      <motion.div
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search galleries..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStatus(option)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium capitalize transition-all",
                  status === option
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option === "all" ? "All" : option}
              </button>
            ))}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                {SORT_LABELS[sort]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => setSort(value as typeof sort)}
                  className={cn(sort === value && "font-medium text-primary")}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      <motion.div
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <motion.div key={index} variants={staggerItem}>
              <GalleryCardSkeleton />
            </motion.div>
          ))}

        {!isLoading && data?.galleries.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-primary/25 bg-primary/4 p-10 text-center text-sm text-muted-foreground">
            No galleries match your filters.
          </div>
        )}

        {data?.galleries.map((gallery) => (
          <motion.div key={gallery.id} variants={staggerItem}>
            <GalleryCard
              gallery={gallery}
              onDelete={handleDelete}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
