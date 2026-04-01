import { Badge } from "@workspace/ui/components/badge";

type DesignStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "CHANGES_REQUESTED" | "REJECTED";

interface StatusBadgeProps {
  status: DesignStatus;
}

const STATUS_CONFIG: Record<DesignStatus, { label: string; variant: "outline" | "secondary" | "default" | "destructive" }> = {
  DRAFT: { label: "Draft", variant: "outline" },
  SUBMITTED: { label: "Submitted", variant: "secondary" },
  APPROVED: { label: "Approved", variant: "default" },
  CHANGES_REQUESTED: { label: "Changes Requested", variant: "destructive" },
  REJECTED: { label: "Rejected", variant: "destructive" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, variant: "outline" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
