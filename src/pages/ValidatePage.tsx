import { AppShell } from "@/components/atlas/AppShell";
import { StatusBadge } from "@/components/atlas/StatusBadge";
import { useAssetRegistry, useSubmitValidation, useValidator } from "@/lib/atlas/hooks";
import { fmtUSD } from "@/lib/atlas/format";
import { useMemo, useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const ValidatePage = () => {
  const { data: assets } = useAssetRegistry();
  const { data: validator } = useValidator();
  const { submit, isPending } = useSubmitValidation();

  const queue = useMemo(() => assets?.filter((a) => a.status !== "rejected") ?? [], [assets]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = queue.find((a) => a.id === activeId) ?? queue[0];

  const [scores, setScores] = useState({ truth: 75, env: 70, social: 70, resilience: 70 });
  const [rationale, setRationale] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const consistencyDelta = active ? Math.abs(scores.truth - active.truthScore) : 0;
  const inconsistent = consistencyDelta > 25;

  const onSubmit = async () => {
    if (!active) return;
    if (rationale.trim().length < 30) return;
    await submit(active.id, { ...scores, rationale });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2400);
  };

  return (
    <AppShell>
      <header className="mb-8">
        <div className="label-eyebrow">Validator Console</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Submit truth. Be accountable.</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
          Your stake is bound to your attestation. Inconsistent submissions reduce reputation and stake weight.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Validator profile */}
        <aside className="col-span-12 lg:col-span-3 panel p-5 h-fit">
          <div className="text-[12px] font-medium">Your Validator</div>
          <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{validator?.address ?? "—"}</div>
          <div className="mt-5 space-y-4">
            <div>
              <div className="label-eyebrow">Stake</div>
              <div className="metric text-lg mt-1">{validator ? fmtUSD(validator.stake) : "··"}</div>
            </div>
            <div>
              <div className="label-eyebrow">Reputation</div>
              <div className="metric text-lg mt-1 text-truth">{validator?.reputation ?? "··"}</div>
            </div>
            <div>
              <div className="label-eyebrow">Pending</div>
              <div className="metric text-lg mt-1">{validator?.pending.length ?? 0}</div>
            </div>
          </div>
        </aside>

        {/* Queue */}
        <section className="col-span-12 lg:col-span-4 panel">
          <div className="px-4 py-3 border-b border-border">
            <div className="text-[12px] font-medium">Validation Queue</div>
            <div className="text-[10px] text-muted-foreground">{queue.length} assets awaiting attestation</div>
          </div>
          <ul>
            {queue.map((a) => (
              <li key={a.id}>
                <button
                  onClick={() => { setActiveId(a.id); setSubmitted(false); }}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b border-border/60 hover:bg-surface-elevated transition-colors",
                    active?.id === a.id && "bg-surface-elevated"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-medium truncate">{a.name}</span>
                    <StatusBadge status={a.status} />
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-1">
                    {a.ticker} · current truth {a.truthScore} · {a.truth.validators} attestations
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Form */}
        <section className="col-span-12 lg:col-span-5 panel p-5">
          {!active ? (
            <div className="text-center text-sm text-muted-foreground py-12">No assets in queue.</div>
          ) : (
            <>
              <div className="flex items-baseline justify-between mb-1">
                <div className="text-[12px] font-medium">Submit Attestation</div>
                <span className="text-[10px] font-mono text-muted-foreground">{active.ticker}</span>
              </div>
              <div className="text-[11px] text-muted-foreground mb-5">{active.name}</div>

              <div className="space-y-5">
                <SliderField label="Truth Score" value={scores.truth} onChange={(v) => setScores({ ...scores, truth: v })} hint={`Registry: ${active.truthScore}`} />
                <div className="grid grid-cols-3 gap-4">
                  <SliderField label="Environmental" value={scores.env} onChange={(v) => setScores({ ...scores, env: v })} compact />
                  <SliderField label="Social" value={scores.social} onChange={(v) => setScores({ ...scores, social: v })} compact />
                  <SliderField label="Resilience" value={scores.resilience} onChange={(v) => setScores({ ...scores, resilience: v })} compact />
                </div>

                <div>
                  <label className="label-eyebrow">Rationale (required, ≥30 chars)</label>
                  <textarea
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    rows={4}
                    placeholder="Cite data sources, methodology, and what evidence drove your score."
                    className="mt-2 w-full bg-input border border-border-strong rounded-sm px-3 py-2 text-[12px] focus:outline-none focus:border-truth resize-none"
                  />
                  <div className="text-[10px] text-muted-foreground mt-1">{rationale.length} / 30+ chars</div>
                </div>

                {inconsistent && (
                  <div className="flex items-start gap-2 p-3 border border-review/30 bg-review-muted/40 rounded-sm">
                    <AlertTriangle className="h-3.5 w-3.5 text-review mt-0.5 shrink-0" />
                    <div className="text-[11px] text-review">
                      Your truth score deviates {consistencyDelta} points from registry consensus. Strong rationale required.
                    </div>
                  </div>
                )}

                {submitted && (
                  <div className="flex items-center gap-2 p-3 border border-truth/30 bg-truth-muted/40 rounded-sm">
                    <Check className="h-3.5 w-3.5 text-truth" />
                    <div className="text-[11px] text-truth">Attestation submitted. Awaiting consensus inclusion.</div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button className="text-[11px] text-muted-foreground hover:text-violation inline-flex items-center gap-1.5">
                    <AlertTriangle className="h-3 w-3" /> Flag inconsistency
                  </button>
                  <button
                    onClick={onSubmit}
                    disabled={isPending || rationale.trim().length < 30}
                    className="px-4 py-2 text-[12px] rounded-sm bg-truth text-truth-foreground hover:bg-truth/90 disabled:bg-secondary disabled:text-muted-foreground disabled:cursor-not-allowed font-medium"
                  >
                    {isPending ? "Submitting…" : "Submit Attestation"}
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </AppShell>
  );
};

function SliderField({ label, value, onChange, hint, compact }: { label: string; value: number; onChange: (v: number) => void; hint?: string; compact?: boolean }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="label-eyebrow">{label}</label>
        <span className={cn("metric font-semibold", compact ? "text-sm" : "text-base", "text-foreground")}>{value}</span>
      </div>
      <input
        type="range" min={0} max={100} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full mt-2 accent-truth"
      />
      {hint && <div className="text-[10px] text-muted-foreground mt-1 font-mono">{hint}</div>}
    </div>
  );
}

export default ValidatePage;
