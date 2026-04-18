import { AppShell } from "@/components/atlas/AppShell";
import { ScoreMeter } from "@/components/atlas/ScoreMeter";
import { StatusBadge } from "@/components/atlas/StatusBadge";
import { useAsset } from "@/lib/atlas/hooks";
import { fmtPct, fmtUSD } from "@/lib/atlas/format";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ChallengeAssetDialog } from "@/components/atlas/ChallengeAssetDialog";

const AssetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: asset, isLoading } = useAsset(id);

  if (isLoading) {
    return (
      <AppShell>
        <div className="space-y-4 animate-pulse">
          <div className="h-6 w-48 bg-secondary rounded-sm" />
          <div className="h-32 bg-secondary/60 rounded-sm" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-48 bg-secondary/60 rounded-sm" />
            <div className="h-48 bg-secondary/60 rounded-sm" />
            <div className="h-48 bg-secondary/60 rounded-sm" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (!asset) {
    return (
      <AppShell>
        <div className="text-center py-24">
          <div className="text-sm text-muted-foreground">Asset not found in registry.</div>
          <Link to="/" className="text-truth text-sm mt-3 inline-block">← Return to dashboard</Link>
        </div>
      </AppShell>
    );
  }

  const allocBlocked = asset.status === "rejected";

  return (
    <AppShell>
      <Link to="/" className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-3 w-3" /> Registry
      </Link>

      {/* Header */}
      <header className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-12 lg:col-span-7">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] font-mono text-muted-foreground">{asset.ticker}</span>
            <span className="text-muted-foreground/50">·</span>
            <span className="text-[11px] text-muted-foreground">{asset.category}</span>
            <StatusBadge status={asset.status} />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{asset.name}</h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-2xl leading-relaxed">{asset.thesis}</p>
        </div>

        <div className="col-span-12 lg:col-span-5 panel-elevated p-5">
          <div className="grid grid-cols-2 gap-6">
            <ScoreMeter value={asset.truthScore} tone="truth" label="Truth Score" sublabel="verified" size="lg" />
            <ScoreMeter
              value={asset.impactScore}
              tone={asset.impactScore >= 60 ? "truth" : "review"}
              label="Impact Score"
              sublabel="regenerative"
              size="lg"
            />
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="grid grid-cols-12 gap-6">
        {/* Truth breakdown */}
        <section className="col-span-12 lg:col-span-6 panel p-5">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-[12px] font-medium">Truth Breakdown</h2>
            <span className="text-[10px] text-muted-foreground">{asset.truth.validators} validators · {asset.truth.confidence}% confidence</span>
          </div>
          <div className="space-y-3">
            {asset.truth.sources.map((s) => (
              <div key={s.name} className="flex items-center justify-between gap-3 py-2 border-b border-border/40 last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] truncate">{s.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">weight {(s.weight * 100).toFixed(0)}%</div>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 divider-soft">
            <ScoreMeter value={asset.truth.validatorConsensus} tone="truth" label="Validator Consensus" size="sm" />
          </div>
        </section>

        {/* Impact breakdown */}
        <section className="col-span-12 lg:col-span-6 panel p-5">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-[12px] font-medium">Impact Breakdown</h2>
            <span className="text-[10px] text-muted-foreground">via ImpactOracle</span>
          </div>
          <div className="space-y-5">
            <ScoreMeter value={asset.impact.environmental} tone="truth" label="Environmental" size="sm" />
            <ScoreMeter value={asset.impact.social} tone="capital" label="Social" size="sm" />
            <ScoreMeter value={asset.impact.resilience} tone="truth" label="Resilience" size="sm" />
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mt-5 pt-4 divider-soft">
            {asset.impact.summary}
          </p>
        </section>

        {/* Financials */}
        <section className="col-span-12 lg:col-span-5 panel p-5">
          <h2 className="text-[12px] font-medium mb-4">Financials</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="label-eyebrow">Expected Return</div>
              <div className="metric text-2xl font-semibold mt-1">{fmtPct(asset.expectedReturn)}</div>
              <div className="text-[10px] text-muted-foreground mt-1">annualized, projected</div>
            </div>
            <div className="bg-truth-muted/50 rounded-sm p-3 -m-1 border border-truth/20">
              <div className="label-eyebrow text-truth/80">Truth Yield</div>
              <div className="metric text-2xl font-semibold mt-1 text-truth">{fmtPct(asset.truthYield)}</div>
              <div className="text-[10px] text-muted-foreground mt-1">regenerative yield only</div>
            </div>
          </div>
          <div className="mt-5 pt-4 divider-soft">
            <div className="flex items-baseline justify-between">
              <span className="label-eyebrow">Total Allocated</span>
              <span className="metric text-sm">{fmtUSD(asset.totalAllocated)}</span>
            </div>
          </div>
        </section>

        {/* Audit trail */}
        <section className="col-span-12 lg:col-span-7 panel p-5">
          <h2 className="text-[12px] font-medium mb-4">Audit Trail</h2>
          <ol className="space-y-3">
            {asset.audit.map((e, i) => (
              <li key={i} className="flex gap-4 text-[12px]">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-truth mt-1.5" />
                  {i < asset.audit.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-foreground">{e.event}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{new Date(e.ts).toLocaleString()}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    {e.actor} · <span className="text-muted-foreground/70">{e.hash}</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Actions */}
        <section className="col-span-12 panel-elevated p-5 flex items-center justify-between">
          <div>
            <div className="text-[12px] font-medium">Capital Action</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {allocBlocked
                ? "Allocation blocked — asset fails doctrine on regeneration."
                : "Allocation requires passing the doctrine check before confirmation."}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ChallengeAssetDialog asset={asset} />
            <button
              disabled={allocBlocked}
              onClick={() => navigate(`/allocate/${asset.id}`)}
              className="px-4 py-2 text-[12px] rounded-sm bg-truth text-truth-foreground hover:bg-truth/90 disabled:bg-secondary disabled:text-muted-foreground disabled:cursor-not-allowed font-medium"
            >
              Allocate Capital
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default AssetPage;
