import { Badge } from "@workspace/ui/components/badge";

type Props = {
  status: "draft" | "published";
};

export function GalleryStatusBadge({ status }: Props) {
  return (
    <Badge className={status === "published" ? "bg-emerald-600" : "bg-zinc-600"}>
      {status === "published" ? "Published" : "Draft"}
    </Badge>
  );
}
