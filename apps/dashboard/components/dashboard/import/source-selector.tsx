import Image from "next/image";
import { cn } from "@workspace/ui/lib/utils";

export type ImportSource = "gdrive" | "gphotos";

export function SourceSelector({
  onSelect,
}: {
  onSelect: (source: ImportSource) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SourceCard
        icon="/google-drive.svg"
        title="Google Drive"
        description="Import photo folders from your Google Drive"
        onClick={() => onSelect("gdrive")}
      />
      <SourceCard
        icon="/google-photos.svg"
        title="Google Photos"
        description="Pick photos from your Google Photos library"
        onClick={() => onSelect("gphotos")}
      />
    </div>
  );
}

function SourceCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center gap-3 rounded-xl border-2 border-border bg-card p-8 text-center transition-all",
        "hover:border-primary/50 hover:bg-primary/4 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted/60 transition-colors group-hover:bg-primary/10">
        <Image src={icon} alt={title} width={28} height={28} />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}
