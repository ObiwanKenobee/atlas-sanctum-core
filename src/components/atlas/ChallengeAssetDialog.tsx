import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Plus, X } from "lucide-react";
import { Asset } from "@/lib/atlas/types";
import { useChallengeAsset } from "@/lib/atlas/hooks";
import { cn } from "@/lib/utils";
import { fmtPct } from "@/lib/atlas/format";

interface Props {
  asset: Asset;
  trigger?: React.ReactNode;
}

const URL_RE = /^https?:\/\/[^\s]+$/i;
const MIN_RATIONALE = 80;
const MIN_STAKE = 100;

export function ChallengeAssetDialog({ asset, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const { challenge, isPending, txHash } = useChallengeAsset();

  const [stake, setStake] = useState<number>(500);
  const [rationale, setRationale] = useState("");
  const [counterScore, setCounterScore] = useState<number>(Math.max(0, asset.truthScore - 20));
  const [evidence, setEvidence] = useState<string[]>([""]);

  const validEvidence = useMemo(() => evidence.filter((u) => URL_RE.test(u.trim())), [evidence]);
  const hasValidEvidence = validEvidence.length >= 1;
  const rationaleOk = rationale.trim().length >= MIN_RATIONALE;
  const stakeOk = stake >= MIN_STAKE;
  const scoreDelta = Math.abs(counterScore - asset.truthScore);
  const scoreOk = counterScore >= 0 && counterScore <= 100 && scoreDelta >= 5;

  const canSubmit = rationaleOk && stakeOk && scoreOk && hasValidEvidence && !isPending;

  const reset = () => {
    setStake(500);
    setRationale("");
    setCounterScore(Math.max(0, asset.truthScore - 20));
    setEvidence([""]);
  };

  const onSubmit = async () => {
    if (!canSubmit) return;
    await challenge(asset.id, {
      stake,
      rationale: rationale.trim(),
      counterScore,
      evidence: validEvidence,
    });
    setTimeout(() => {
      setOpen(false);
      reset();
    }, 1200);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <button className="px-3 py-2 text-[12px] rounded-sm border border-border-strong text-muted-foreground hover:text-foreground hover:bg-surface-overlay inline-flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" /> Challenge Asset
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-xl bg-card border-border-strong text-foreground">
        <DialogHeader>
          <div className="label-eyebrow text-violation/80 flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3" /> Truth Dispute
          </div>
          <DialogTitle className="text-lg font-semibold mt-1">Challenge {asset.ticker}</DialogTitle>
          <DialogDescription className="text-[12px] text-muted-foreground">
            Stake capital to dispute the current truth attestation. If consensus shifts your way, your stake is returned with a slashing reward. If you fail, your stake is slashed.
          </DialogDescription>
        </DialogHeader>

        {txHash ? (
          <div className="py-8 text-center space-y-2">
            <div className="text-truth text-[13px] font-medium">Challenge submitted</div>
            <div className="text-[11px] text-muted-foreground font-mono">{txHash}</div>
            <div className="text-[11px] text-muted-foreground">Validator review opens in &lt;2 epochs.</div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Stake */}
            <div>
              <div className="flex items-baseline justify-between">
                <label className="label-eyebrow">Stake (USD)</label>
                <span className={cn("text-[10px]", stakeOk ? "text-muted-foreground" : "text-violation")}>
                  min ${MIN_STAKE}
                </span>
              </div>
              <input
                type="number"
                min={MIN_STAKE}
                step={100}
                value={stake}
                onChange={(e) => setStake(Number(e.target.value))}
                className="mt-2 w-full bg-input border border-border-strong rounded-sm px-3 py-2 text-sm metric focus:outline-none focus:border-truth"
              />
            </div>

            {/* Counter score */}
            <div>
              <div className="flex items-baseline justify-between">
                <label className="label-eyebrow">Counter Truth Score</label>
                <span className="text-[10px] text-muted-foreground">
                  current <span className="metric text-foreground">{asset.truthScore}</span> · your claim{" "}
                  <span className={cn("metric", scoreOk ? "text-violation" : "text-muted-foreground")}>{counterScore}</span>
                  {scoreOk && (
                    <span className="ml-1 text-violation/80">({fmtPct(((counterScore - asset.truthScore) / asset.truthScore) * 100)} delta)</span>
                  )}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={counterScore}
                onChange={(e) => setCounterScore(Number(e.target.value))}
                className="mt-2 w-full accent-violation"
              />
              {!scoreOk && (
                <div className="text-[10px] text-violation mt-1">Counter score must differ from current by ≥ 5 points.</div>
              )}
            </div>

            {/* Rationale */}
            <div>
              <div className="flex items-baseline justify-between">
                <label className="label-eyebrow">Rationale</label>
                <span className={cn("text-[10px]", rationaleOk ? "text-truth/70" : "text-muted-foreground")}>
                  {rationale.trim().length}/{MIN_RATIONALE} min
                </span>
              </div>
              <textarea
                rows={4}
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="Cite the specific data source, attestation, or measurement you believe is incorrect, and why."
                className="mt-2 w-full bg-input border border-border-strong rounded-sm px-3 py-2 text-[12px] focus:outline-none focus:border-truth resize-none"
              />
            </div>

            {/* Evidence URLs */}
            <div>
              <div className="flex items-baseline justify-between">
                <label className="label-eyebrow">Evidence URLs</label>
                <span className={cn("text-[10px]", hasValidEvidence ? "text-truth/70" : "text-muted-foreground")}>
                  {validEvidence.length} valid
                </span>
              </div>
              <div className="mt-2 space-y-2">
                {evidence.map((url, i) => {
                  const ok = !url || URL_RE.test(url.trim());
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="url"
                        value={url}
                        placeholder="https://…"
                        onChange={(e) => {
                          const next = [...evidence];
                          next[i] = e.target.value;
                          setEvidence(next);
                        }}
                        className={cn(
                          "flex-1 bg-input border rounded-sm px-3 py-2 text-[12px] metric focus:outline-none",
                          ok ? "border-border-strong focus:border-truth" : "border-violation/50 focus:border-violation"
                        )}
                      />
                      {evidence.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setEvidence(evidence.filter((_, j) => j !== i))}
                          className="h-8 w-8 rounded-sm border border-border text-muted-foreground hover:text-violation hover:border-violation/40 inline-flex items-center justify-center"
                          aria-label="Remove evidence URL"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setEvidence([...evidence, ""])}
                  className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Add URL
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 divider-soft">
              <div className="text-[10px] text-muted-foreground max-w-xs leading-relaxed">
                Frivolous challenges are slashed. Validators review within 2 epochs.
              </div>
              <button
                onClick={onSubmit}
                disabled={!canSubmit}
                className="px-4 py-2 text-[12px] rounded-sm bg-violation text-destructive-foreground hover:bg-violation/90 disabled:bg-secondary disabled:text-muted-foreground disabled:cursor-not-allowed font-medium"
              >
                {isPending ? "Staking…" : "Stake & Submit"}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
