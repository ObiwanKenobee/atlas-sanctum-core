import { Asset } from "@/lib/atlas/types";
import { useNavigate } from "react-router-dom";
import { StatusBadge } from "./StatusBadge";
import { fmtUSD } from "@/lib/atlas/format";
import { cn } from "@/lib/utils";

function scoreColor(n: number) {
  if (n >= 80) return "text-truth";
  if (n >= 60) return "text-review";
  return "text-violation";
}

export function AssetRow({ asset }: { asset: Asset }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/asset/${asset.id}`)}
      className="w-full grid grid-cols-12 gap-4 items-center px-4 py-3.5 border-b border-border/60 hover:bg-surface-elevated transition-colors text-left group"
    >
      <div className="col-span-5">
        <div className="text-[13px] font-medium text-foreground truncate">{asset.name}</div>
        <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
          {asset.ticker} · <span className="text-muted-foreground/70">{asset.category}</span>
        </div>
      </div>

      <div className="col-span-2 text-right">
        <div className={cn("metric text-base font-semibold", scoreColor(asset.truthScore))}>{asset.truthScore}</div>
        <div className="label-eyebrow mt-0.5">Truth</div>
      </div>

      <div className="col-span-2 text-right">
        <div className={cn("metric text-base font-semibold", scoreColor(asset.impactScore))}>{asset.impactScore}</div>
        <div className="label-eyebrow mt-0.5">Impact</div>
      </div>

      <div className="col-span-2 text-right">
        <div className="metric text-[13px] text-foreground">{fmtUSD(asset.totalAllocated)}</div>
        <div className="label-eyebrow mt-0.5">Allocated</div>
      </div>

      <div className="col-span-1 flex justify-end">
        <StatusBadge status={asset.status} />
      </div>
    </button>
  );
}
