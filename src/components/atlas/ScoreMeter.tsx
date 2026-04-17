import { cn } from "@/lib/utils";

type Tone = "truth" | "capital" | "review" | "violation" | "muted";

const toneCls: Record<Tone, string> = {
  truth: "bg-truth",
  capital: "bg-capital",
  review: "bg-review",
  violation: "bg-violation",
  muted: "bg-muted-foreground/40",
};

export function ScoreMeter({
  value, tone = "truth", label, sublabel, size = "md",
}: { value: number; tone?: Tone; label?: string; sublabel?: string; size?: "sm" | "md" | "lg" }) {
  const v = Math.max(0, Math.min(100, value));
  const h = size === "lg" ? "h-2" : size === "sm" ? "h-1" : "h-1.5";
  const num = size === "lg" ? "text-4xl" : size === "sm" ? "text-base" : "text-2xl";
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-baseline justify-between">
          <span className="label-eyebrow">{label}</span>
          {sublabel && <span className="text-[10px] text-muted-foreground">{sublabel}</span>}
        </div>
      )}
      <div className="flex items-baseline gap-2">
        <span className={cn("metric font-semibold text-foreground", num)}>{v.toFixed(0)}</span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
      <div className={cn("w-full rounded-full bg-secondary overflow-hidden", h)}>
        <div className={cn("h-full transition-all duration-500", toneCls[tone])} style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
