import { AssetStatus } from "@/lib/atlas/types";
import { cn } from "@/lib/utils";

const map: Record<AssetStatus, { label: string; cls: string }> = {
  verified: { label: "Verified", cls: "bg-truth-muted text-truth border-truth/30" },
  review:   { label: "Under Review", cls: "bg-review-muted text-review border-review/30" },
  rejected: { label: "Rejected", cls: "bg-violation-muted text-violation border-violation/30" },
};

export function StatusBadge({ status, className }: { status: AssetStatus; className?: string }) {
  const m = map[status];
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border text-[10px] uppercase tracking-[0.14em] font-medium",
      m.cls, className,
    )}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {m.label}
    </span>
  );
}
