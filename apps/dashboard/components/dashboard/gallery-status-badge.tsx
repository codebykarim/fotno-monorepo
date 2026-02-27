import { cn } from "@workspace/ui/lib/utils";

type Props = {
  status: "draft" | "published";
  showLabel?: boolean;
};

export function GalleryStatusBadge({ status, showLabel = true }: Props) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span
        className={cn(
          "inline-block h-2 w-2 rounded-full",
          status === "published" ? "bg-emerald-500" : "bg-zinc-400",
        )}
      />
      {showLabel && (
        <span className={status === "published" ? "text-emerald-600" : "text-muted-foreground"}>
          {status === "published" ? "Published" : "Draft"}
        </span>
      )}
    </span>
  );
}
