import { NavLink } from "@/components/NavLink";
import { useSystemIntegrity } from "@/lib/atlas/hooks";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { WalletButton } from "./WalletButton";

const NAV = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/validate", label: "Validate" },
  { to: "/portfolio", label: "Portfolio" },
];

export function Header() {
  const { data: sis, isLoading } = useSystemIntegrity();

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="h-6 w-6 rounded-sm border border-truth/40 bg-truth-muted flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-truth" />
            </div>
            <div className="leading-tight">
              <div className="text-[13px] font-semibold tracking-tight">Atlas Sanctum</div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Truth-gated capital</div>
            </div>
          </NavLink>

          <nav className="flex items-center gap-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className="px-3 py-1.5 text-[12px] text-muted-foreground rounded-sm hover:text-foreground hover:bg-surface-elevated transition-colors"
                activeClassName="!text-foreground bg-surface-elevated"
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/sis"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-sm border border-border bg-surface hover:bg-surface-elevated transition-colors"
            title="System Integrity Score — aggregate health of registry, oracle, and consensus. Click for breakdown."
          >
            <span className="label-eyebrow">SIS</span>
            <span className={cn("metric text-sm font-semibold", isLoading ? "text-muted-foreground" : "text-truth")}>
              {isLoading ? "··" : sis}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-truth animate-pulse" />
          </Link>

          <WalletButton />
        </div>
      </div>
    </header>
  );
}
