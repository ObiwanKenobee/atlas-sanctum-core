import { AppShell } from "@/components/atlas/AppShell";
import { ScoreMeter } from "@/components/atlas/ScoreMeter";
import { useAssetRegistry, usePortfolio } from "@/lib/atlas/hooks";
import { fmtPct, fmtUSD } from "@/lib/atlas/format";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowDownRight, ArrowUpRight, Minus, AlertTriangle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PortfolioPage = () => {
  const { data: portfolio, isLoading } = usePortfolio();
  const { data: assets } = useAssetRegistry();
  const [params] = useSearchParams();
  const tx = params.get("tx");

  if (isLoading || !portfolio || !assets) {
    return <AppShell><div className="h-96 panel animate-pulse" /></AppShell>;
  }

  const enriched = portfolio.holdings.map((h) => ({ ...h, asset: assets.find((a) => a.id === h.assetId)! }));

  return (
    <AppShell>
      {tx && (
        <div className="mb-6 flex items-center gap-2 p-3 border border-truth/30 bg-truth-muted/40 rounded-sm">
          <Check className="h-3.5 w-3.5 text-truth" />
          <div className="text-[11px] text-truth">Allocation confirmed · <span className="font-mono">{tx}</span></div>
        </div>
      )}

      <header className="mb-8">
        <div className="label-eyebrow">Portfolio</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Truth-aligned capital</h1>
      </header>

      {/* Top metrics */}
      <section className="grid grid-cols-12 gap-4 mb-6">
        <div className="col-span-12 md:col-span-3 panel p-5">
          <div className="label-eyebrow">Total Value</div>
          <div className="metric text-3xl font-semibold mt-2">{fmtUSD(portfolio.totalValue)}</div>
          <div className="text-[11px] text-muted-foreground mt-1">across {portfolio.holdings.length} holdings</div>
        </div>
        <div className="col-span-12 md:col-span-3 panel-elevated p-5 border-truth/20">
          <div className="label-eyebrow text-truth/80">Truth Yield</div>
          <div className="metric text-3xl font-semibold mt-2 text-truth">{fmtPct(portfolio.truthYield)}</div>
          <div className="text-[11px] text-muted-foreground mt-1">primary protocol metric</div>
        </div>
        <div className="col-span-12 md:col-span-3 panel p-5">
          <div className="label-eyebrow">Regenerative Alpha</div>
          <div className="metric text-3xl font-semibold mt-2">+{fmtPct(portfolio.regenerativeAlpha)}</div>
          <div className="text-[11px] text-muted-foreground mt-1">vs extractive baseline</div>
        </div>
        <div className="col-span-12 md:col-span-3 panel p-5">
          <div className="label-eyebrow">Ethical Liquidity</div>
          <div className="metric text-3xl font-semibold mt-2">{portfolio.ethicalLiquidityScore}</div>
          <div className="text-[11px] text-muted-foreground mt-1">exit without harm</div>
        </div>
      </section>

      {/* Holdings */}
      <section className="panel">
        <div className="px-4 py-3 border-b border-border">
          <div className="text-[12px] font-medium">Holdings</div>
          <div className="text-[10px] text-muted-foreground">Each position is gated by ongoing truth attestations.</div>
        </div>

        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 border-b border-border bg-surface/40">
          <div className="col-span-4 label-eyebrow">Asset</div>
          <div className="col-span-2 label-eyebrow text-right">Value</div>
          <div className="col-span-2 label-eyebrow text-right">Truth Trend</div>
          <div className="col-span-3 label-eyebrow">Impact Contribution</div>
          <div className="col-span-1 label-eyebrow text-right">Alert</div>
        </div>

        {enriched.map((h) => (
          <Link
            key={h.assetId}
            to={`/asset/${h.assetId}`}
            className="grid grid-cols-12 gap-4 items-center px-4 py-4 border-b border-border/60 hover:bg-surface-elevated transition-colors"
          >
            <div className="col-span-4">
              <div className="text-[13px] font-medium">{h.asset.name}</div>
              <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{h.asset.ticker}</div>
            </div>
            <div className="col-span-2 text-right">
              <div className="metric text-[13px]">{fmtUSD(h.value)}</div>
            </div>
            <div className="col-span-2 flex items-center justify-end gap-1.5">
              {h.truthTrend > 0 ? <ArrowUpRight className="h-3.5 w-3.5 text-truth" />
                : h.truthTrend < 0 ? <ArrowDownRight className="h-3.5 w-3.5 text-violation" />
                : <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
              <span className={cn("metric text-[12px]",
                h.truthTrend > 0 ? "text-truth" : h.truthTrend < 0 ? "text-violation" : "text-muted-foreground"
              )}>
                {h.truthTrend > 0 ? "+" : ""}{h.truthTrend} pts · 7d
              </span>
            </div>
            <div className="col-span-3">
              <ScoreMeter value={h.impact} tone="truth" size="sm" />
            </div>
            <div className="col-span-1 flex justify-end">
              {h.alert && (
                <span title={h.alert} className="inline-flex items-center gap-1 text-violation">
                  <AlertTriangle className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
          </Link>
        ))}
      </section>

      <p className="text-[10px] text-muted-foreground mt-4 max-w-2xl">
        Holdings whose truth scores trend negative are flagged automatically. The protocol may pause yield distribution
        until consensus is restored.
      </p>
    </AppShell>
  );
};

export default PortfolioPage;
