import { usePortfolio } from "@/lib/atlas/hooks";
import { fmtPct, fmtUSD } from "@/lib/atlas/format";

function Stat({ label, value, sub, tone = "default" }: { label: string; value: string; sub?: string; tone?: "default" | "truth" }) {
  return (
    <div className="flex-1 px-5 py-4">
      <div className="label-eyebrow">{label}</div>
      <div className={`metric text-2xl font-semibold mt-1 ${tone === "truth" ? "text-truth" : "text-foreground"}`}>{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

export function AlignmentPanel() {
  const { data, isLoading } = usePortfolio();
  if (isLoading || !data) {
    return <div className="panel h-24 animate-pulse" />;
  }
  return (
    <section className="panel">
      <div className="px-5 py-2.5 border-b border-border flex items-center justify-between">
        <div className="text-[12px] font-medium">Your Alignment</div>
        <div className="text-[10px] text-muted-foreground">Updated · 2 min ago</div>
      </div>
      <div className="flex divide-x divide-border">
        <Stat label="Portfolio Value" value={fmtUSD(data.totalValue)} sub="across 4 holdings" />
        <Stat label="Truth Yield" value={fmtPct(data.truthYield)} sub="regenerative annualized" tone="truth" />
        <Stat label="Regenerative Alpha" value={`+${fmtPct(data.regenerativeAlpha)}`} sub="vs extractive baseline" />
        <Stat label="Ethical Liquidity" value={`${data.ethicalLiquidityScore}`} sub="exit without harm" />
      </div>
    </section>
  );
}
