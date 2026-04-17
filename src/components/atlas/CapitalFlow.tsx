import { useCapitalFlow } from "@/lib/atlas/hooks";
import { fmtUSD } from "@/lib/atlas/format";

export function CapitalFlow() {
  const { data, isLoading } = useCapitalFlow();
  return (
    <aside className="panel">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <div className="text-[12px] font-medium">Capital Flow Pulse</div>
          <div className="text-[10px] text-muted-foreground">Recent verified allocations</div>
        </div>
        <span className="h-1.5 w-1.5 rounded-full bg-truth animate-pulse" />
      </div>
      <ul className="divide-y divide-border/60">
        {isLoading && Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="px-4 py-3 animate-pulse">
            <div className="h-3 w-2/3 bg-secondary rounded-sm" />
            <div className="h-2 w-1/3 bg-secondary/60 rounded-sm mt-2" />
          </li>
        ))}
        {data?.map((f, i) => (
          <li key={i} className="px-4 py-3 flex items-start justify-between gap-3">
            <div>
              <div className="text-[12px] font-mono text-foreground">{f.asset}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{f.actor} · {f.ts}</div>
            </div>
            <div className="metric text-[12px] text-truth font-medium">+{fmtUSD(f.amount)}</div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
