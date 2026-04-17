import { AppShell } from "@/components/atlas/AppShell";
import { AssetRow } from "@/components/atlas/AssetRow";
import { CapitalFlow } from "@/components/atlas/CapitalFlow";
import { AlignmentPanel } from "@/components/atlas/AlignmentPanel";
import { useAssetRegistry } from "@/lib/atlas/hooks";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "all", label: "All Assets" },
  { key: "verified", label: "Verified" },
  { key: "review", label: "Under Review" },
  { key: "rejected", label: "Rejected" },
] as const;

const Index = () => {
  const { data: assets, isLoading, error } = useAssetRegistry();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");

  const filtered = assets?.filter((a) => filter === "all" || a.status === filter) ?? [];

  return (
    <AppShell>
      {/* Doctrine bar */}
      <section className="mb-8">
        <div className="label-eyebrow mb-2">The Three Questions</div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight max-w-3xl">
          Is this asset <span className="text-truth">true</span>?
          Does it <span className="text-truth">regenerate</span> value?
          Should capital <span className="text-truth">flow</span> here?
        </h1>
        <p className="text-sm text-muted-foreground mt-3 max-w-2xl">
          Atlas Sanctum gates capital behind verifiable truth and measurable regeneration.
          Every number below is traceable to its source.
        </p>
      </section>

      <div className="grid grid-cols-12 gap-6">
        {/* Main feed */}
        <section className="col-span-12 lg:col-span-8">
          <div className="panel">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div>
                <div className="text-[12px] font-medium">Asset Registry</div>
                <div className="text-[10px] text-muted-foreground">
                  {isLoading ? "Reading on-chain registry…" : `${filtered.length} of ${assets?.length} assets`}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={cn(
                      "px-2.5 py-1 text-[11px] rounded-sm border transition-colors",
                      filter === f.key
                        ? "border-border-strong bg-surface-elevated text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Header row */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 border-b border-border bg-surface/40">
              <div className="col-span-5 label-eyebrow">Asset</div>
              <div className="col-span-2 label-eyebrow text-right">Truth</div>
              <div className="col-span-2 label-eyebrow text-right">Impact</div>
              <div className="col-span-2 label-eyebrow text-right">Allocated</div>
              <div className="col-span-1 label-eyebrow text-right">Status</div>
            </div>

            {/* States */}
            {error && (
              <div className="px-4 py-12 text-center text-violation text-sm">
                Registry unreachable. Capital flow paused by protocol.
              </div>
            )}
            {isLoading && (
              <div>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-border/60 animate-pulse">
                    <div className="col-span-5 h-4 bg-secondary rounded-sm" />
                    <div className="col-span-2 h-4 bg-secondary rounded-sm" />
                    <div className="col-span-2 h-4 bg-secondary rounded-sm" />
                    <div className="col-span-2 h-4 bg-secondary rounded-sm" />
                    <div className="col-span-1 h-4 bg-secondary rounded-sm" />
                  </div>
                ))}
              </div>
            )}
            {!isLoading && !error && filtered.length === 0 && (
              <div className="px-4 py-16 text-center">
                <div className="text-sm text-muted-foreground">No assets match this filter.</div>
                <div className="text-[11px] text-muted-foreground/70 mt-1">Discipline is also a form of capital.</div>
              </div>
            )}
            {!isLoading && filtered.map((a) => <AssetRow key={a.id} asset={a} />)}
          </div>
        </section>

        {/* Right panel */}
        <div className="col-span-12 lg:col-span-4">
          <CapitalFlow />
        </div>
      </div>

      {/* Bottom alignment */}
      <div className="mt-6">
        <AlignmentPanel />
      </div>
    </AppShell>
  );
};

export default Index;
