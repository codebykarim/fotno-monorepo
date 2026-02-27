import { Skeleton } from "@workspace/ui/components/skeleton";

export function GalleryCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
      <div className="aspect-[4/3] w-full">
        <div className="grid h-full w-full grid-cols-4 grid-rows-3 gap-px bg-border/30">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-full w-full rounded-none" />
          ))}
        </div>
      </div>
      <div className="px-3.5 py-3 space-y-1.5">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}
