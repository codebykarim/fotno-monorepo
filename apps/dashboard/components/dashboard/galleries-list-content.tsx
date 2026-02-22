"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { apiRequest, jsonFetcher } from "@/lib/api/client";
import { ListGalleriesResponse } from "@/lib/types/api";
import { GalleryCard } from "@/components/dashboard/gallery-card";
import { GalleryCardSkeleton } from "@/components/dashboard/gallery-card-skeleton";

export function GalleriesListContent() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "published">("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "title_asc" | "title_desc">("newest");

  const key = useMemo(() => {
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set("q", query.trim());
    }
    params.set("status", status);
    params.set("sort", sort);
    return `/api/galleries?${params.toString()}`;
  }, [query, sort, status]);

  const { data, isLoading, mutate } = useSWR<ListGalleriesResponse>(key, jsonFetcher);

  async function handleDelete(id: string) {
    try {
      await apiRequest<{ success: boolean }>(`/api/galleries/${id}`, { method: "DELETE" });
      toast.success("Gallery deleted");
      await mutate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete gallery");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Galleries</h1>
          <p className="text-muted-foreground">Search, filter, and manage all delivered galleries.</p>
        </div>
        <Button asChild>
          <Link href="/galleries/new">
            <Plus className="mr-2 h-4 w-4" />
            New Gallery
          </Link>
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Input
          placeholder="Search by title or slug"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <Select value={status} onValueChange={(value) => setStatus(value as "all" | "draft" | "published")}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sort}
          onValueChange={(value) =>
            setSort(value as "newest" | "oldest" | "title_asc" | "title_desc")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="title_asc">Title A-Z</SelectItem>
            <SelectItem value="title_desc">Title Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading && Array.from({ length: 6 }).map((_, index) => <GalleryCardSkeleton key={index} />)}

        {!isLoading && data?.galleries.length === 0 && (
          <div className="col-span-full rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
            No galleries match your filters.
          </div>
        )}

        {data?.galleries.map((gallery) => (
          <GalleryCard key={gallery.id} gallery={gallery} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
