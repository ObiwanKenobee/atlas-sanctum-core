import { AppShell } from "@/components/atlas/AppShell";
import { ScoreMeter } from "@/components/atlas/ScoreMeter";
import { SIS_COMPONENTS, SLASHING_EVENTS } from "@/lib/atlas/sisMock";
import { useSystemIntegrity } from "@/lib/atlas/hooks";
import { fmtUSD } from "@/lib/atlas/format";
import { Activity, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

const SISPage = () => {
  const { data: sis, isLoading } = useSystemIntegrity();

  // Recompute weighted score from components for transparency.
  const computed = Math.round(
    SIS_COMPONENTS.reduce((acc, c) => acc + c.value * c.weight, 0)
  );

  return (
    <AppShell>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground mb-6"
      >
        ← Registry
      </Link>

      {/* Header */}
      <header className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-12 lg:col-span-7">
          <div className="label-eyebrow flex items-center gap-1.5">
            <Activity className="h-3 w-3" /> Protocol Health
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mt-2">
            System Integrity Score
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-2xl leading-relaxed">
            The aggregate health of the truth-gating apparatus. Composed of oracle availability,
            validator participation, attestation freshness, and consensus variance. Every input is
            on-chain and traceable.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-5 panel-elevated p-6">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="label-eyebrow">Current SIS</div>
              <div className="metric text-5xl font-semibold mt-2 text-truth">
                {isLoading ? "··" : sis}
                <span className="text-base text-muted-foreground font-normal ml-1">/100</span>
              </div>
            </div>
            <div className="text-right">
              <div className="label-eyebrow">Computed</div>
              <div className="metric text-sm mt-2">{computed}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">weighted sum</div>
            </div>
          </div>
          <div className="mt-4 pt-4 divider-soft text-[10px] text-muted-foreground">
            Updated every epoch (~12 min). Last block: 19,824,113 · finalized.
          </div>
        </div>
      </header>

      {/* Components */}
      <section className="panel p-5 mb-6">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-[12px] font-medium">Score Composition</h2>
          <span className="text-[10px] text-muted-foreground">4 components · weights sum to 1.00</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SIS_COMPONENTS.map((c) => {
            const tone = c.value >= 80 ? "truth" : c.value >= 60 ? "review" : "violation";
            return (
              <div key={c.key} className="panel-elevated p-4">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <div className="text-[12px] font-medium">{c.label}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      weight {(c.weight * 100).toFixed(0)}% · contributes {(c.value * c.weight).toFixed(1)} pts
                    </div>
                  </div>
                </div>
                <ScoreMeter value={c.value} tone={tone} label="" size="sm" />
                <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">{c.description}</p>
                <p className="text-[10px] text-foreground/70 mt-2 font-mono leading-relaxed">{c.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Slashing */}
      <section className="panel p-5">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[12px] font-medium inline-flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-violation" /> Recent Slashing Events
          </h2>
          <span className="text-[10px] text-muted-foreground">last 14 days</span>
        </div>

        {SLASHING_EVENTS.length === 0 ? (
          <div className="text-[12px] text-muted-foreground py-6 text-center">
            No slashing events. Validator set is operating within tolerance.
          </div>
        ) : (
          <ol className="divide-y divide-border/60">
            {SLASHING_EVENTS.map((e, i) => (
              <li key={i} className="py-3 grid grid-cols-12 gap-3 items-start text-[12px]">
                <div className="col-span-12 md:col-span-3">
                  <div className="metric text-foreground">{e.validator}</div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    {new Date(e.ts).toLocaleString()}
                  </div>
                </div>
                <div className="col-span-8 md:col-span-7 text-foreground/90 leading-relaxed">
                  {e.reason}
                  <div className="text-[10px] text-muted-foreground font-mono mt-1">{e.txHash}</div>
                </div>
                <div className="col-span-4 md:col-span-2 text-right">
                  <div className="metric text-violation">−{fmtUSD(e.amount)}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">slashed</div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </AppShell>
  );
};

export default SISPage;
