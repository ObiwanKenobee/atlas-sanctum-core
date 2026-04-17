import { AppShell } from "@/components/atlas/AppShell";
import { ScoreMeter } from "@/components/atlas/ScoreMeter";
import { StatusBadge } from "@/components/atlas/StatusBadge";
import { useAllocate, useAsset } from "@/lib/atlas/hooks";
import { fmtPct, fmtUSD } from "@/lib/atlas/format";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Check, X, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Asset Summary", "Impact Simulation", "Doctrine Check", "Confirm Allocation"];

const AllocatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: asset, isLoading } = useAsset(id);
  const { allocate, isPending, txHash } = useAllocate();

  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(10_000);
  const [doctrine, setDoctrine] = useState({ truth: false, regen: false, viable: false });

  const doctrinePassed = useMemo(() => {
    const meetsTruth = !!asset && asset.truthScore >= 70;
    const meetsRegen = !!asset && asset.impactScore >= 60 && asset.status !== "rejected";
    const meetsViable = !!asset && asset.truth.confidence >= 70;
    return {
      meetsTruth, meetsRegen, meetsViable,
      all: meetsTruth && meetsRegen && meetsViable && doctrine.truth && doctrine.regen && doctrine.viable,
    };
  }, [asset, doctrine]);

  if (isLoading || !asset) {
    return <AppShell><div className="h-96 panel animate-pulse" /></AppShell>;
  }

  if (asset.status === "rejected") {
    return (
      <AppShell>
        <div className="panel p-12 text-center max-w-xl mx-auto">
          <div className="text-violation text-sm font-medium">Allocation Blocked</div>
          <p className="text-[12px] text-muted-foreground mt-2">
            This asset failed the protocol's doctrine check. Capital may not flow here.
          </p>
          <Link to={`/asset/${asset.id}`} className="text-truth text-[12px] mt-4 inline-block">← Back to asset</Link>
        </div>
      </AppShell>
    );
  }

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const onConfirm = async () => {
    const tx = await allocate(asset.id, amount);
    setTimeout(() => navigate(`/portfolio?tx=${tx.hash}`), 800);
  };

  const canAdvance = step === 2 ? doctrinePassed.all : true;

  return (
    <AppShell>
      <Link to={`/asset/${asset.id}`} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-3 w-3" /> {asset.ticker}
      </Link>

      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="label-eyebrow">Capital Allocation</div>
          <h1 className="text-xl font-semibold mt-1">{asset.name}</h1>
        </div>

        {/* Stepper */}
        <ol className="flex items-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <li key={label} className="flex items-center gap-2 flex-1">
              <div className={cn(
                "h-6 w-6 rounded-full border flex items-center justify-center text-[11px] metric",
                i < step ? "bg-truth border-truth text-truth-foreground"
                : i === step ? "border-truth text-truth"
                : "border-border text-muted-foreground"
              )}>
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              <span className={cn("text-[11px] hidden md:inline", i === step ? "text-foreground" : "text-muted-foreground")}>{label}</span>
              {i < STEPS.length - 1 && <div className={cn("flex-1 h-px", i < step ? "bg-truth" : "bg-border")} />}
            </li>
          ))}
        </ol>

        <div className="panel p-6 min-h-[360px]">
          {step === 0 && (
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[12px] font-medium">Asset Summary</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Verify what you are funding.</div>
                </div>
                <StatusBadge status={asset.status} />
              </div>
              <p className="text-[13px] text-foreground/90 leading-relaxed">{asset.thesis}</p>
              <div className="grid grid-cols-2 gap-6 pt-2">
                <ScoreMeter value={asset.truthScore} tone="truth" label="Truth" />
                <ScoreMeter value={asset.impactScore} tone="truth" label="Impact" />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 divider-soft">
                <div><div className="label-eyebrow">Expected Return</div><div className="metric text-base mt-1">{fmtPct(asset.expectedReturn)}</div></div>
                <div><div className="label-eyebrow">Truth Yield</div><div className="metric text-base mt-1 text-truth">{fmtPct(asset.truthYield)}</div></div>
                <div><div className="label-eyebrow">Validators</div><div className="metric text-base mt-1">{asset.truth.validators}</div></div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <div className="text-[12px] font-medium">Impact Simulation</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Projected outcomes for your allocation.</div>
              </div>

              <div>
                <label className="label-eyebrow">Allocation Amount (USD)</label>
                <input
                  type="number"
                  value={amount}
                  min={100}
                  step={1000}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-2 w-full bg-input border border-border-strong rounded-sm px-3 py-2 text-sm metric focus:outline-none focus:border-truth"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="panel-elevated p-4">
                  <div className="label-eyebrow">Financial · 5yr</div>
                  <div className="metric text-lg mt-1">{fmtUSD(amount * Math.pow(1 + asset.expectedReturn / 100, 5))}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">at {fmtPct(asset.expectedReturn)} compounded</div>
                </div>
                <div className="panel-elevated p-4">
                  <div className="label-eyebrow text-truth/80">Environmental</div>
                  <div className="metric text-lg mt-1 text-truth">{(amount / 1000 * (asset.impact.environmental / 100) * 0.21).toFixed(1)}t</div>
                  <div className="text-[10px] text-muted-foreground mt-1">CO₂e sequestered / yr</div>
                </div>
                <div className="panel-elevated p-4">
                  <div className="label-eyebrow text-capital">Social</div>
                  <div className="metric text-lg mt-1 text-capital">{Math.round(amount / 1000 * (asset.impact.social / 100) * 0.6)}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">household-equivalents supported</div>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground pt-2 divider-soft">
                Projections derived from validated impact coefficients. Past attestations do not guarantee future outcomes.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <div className="text-[12px] font-medium">Doctrine Check</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Affirm your understanding before proceeding.</div>
              </div>

              {[
                { key: "truth" as const, label: "Truth Verified", desc: `Asset truth score ${asset.truthScore} ≥ 70 threshold.`, ok: doctrinePassed.meetsTruth },
                { key: "regen" as const, label: "Regenerative Positive", desc: `Impact score ${asset.impactScore}, status ${asset.status}.`, ok: doctrinePassed.meetsRegen },
                { key: "viable" as const, label: "Long-term Viable", desc: `Confidence ${asset.truth.confidence}% across ${asset.truth.validators} validators.`, ok: doctrinePassed.meetsViable },
              ].map((c) => (
                <label key={c.key} className={cn(
                  "flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-colors",
                  c.ok ? "border-border hover:bg-surface-elevated" : "border-violation/30 bg-violation-muted/30 cursor-not-allowed"
                )}>
                  <input
                    type="checkbox"
                    disabled={!c.ok}
                    checked={doctrine[c.key]}
                    onChange={(e) => setDoctrine({ ...doctrine, [c.key]: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded-sm accent-truth"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium">{c.label}</span>
                      {c.ok ? (
                        <span className="text-[10px] text-truth inline-flex items-center gap-1"><Check className="h-3 w-3" />protocol pass</span>
                      ) : (
                        <span className="text-[10px] text-violation inline-flex items-center gap-1"><X className="h-3 w-3" />protocol fail</span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">{c.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <div className="text-[12px] font-medium">Confirm Allocation</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Final transaction summary.</div>
              </div>

              <div className="panel-elevated p-5 space-y-3">
                {[
                  ["Asset", asset.name],
                  ["Ticker", asset.ticker],
                  ["Amount", fmtUSD(amount)],
                  ["Truth Yield", fmtPct(asset.truthYield)],
                  ["Estimated gas", "~$2.40"],
                  ["Network", "Sanctum L2"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between text-[12px]">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="metric text-foreground">{v}</span>
                  </div>
                ))}
              </div>

              {txHash && (
                <div className="text-[11px] text-truth font-mono">tx · {txHash}</div>
              )}
            </div>
          )}
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={prev}
            disabled={step === 0}
            className="px-3 py-2 text-[12px] rounded-sm border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="h-3 w-3" /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              disabled={!canAdvance}
              className="px-4 py-2 text-[12px] rounded-sm bg-truth text-truth-foreground hover:bg-truth/90 disabled:bg-secondary disabled:text-muted-foreground disabled:cursor-not-allowed font-medium inline-flex items-center gap-1.5"
            >
              Continue <ArrowRight className="h-3 w-3" />
            </button>
          ) : (
            <button
              onClick={onConfirm}
              disabled={isPending}
              className="px-5 py-2 text-[12px] rounded-sm bg-truth text-truth-foreground hover:bg-truth/90 disabled:opacity-60 font-medium"
            >
              {isPending ? "Submitting…" : "Allocate Above"}
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default AllocatePage;
