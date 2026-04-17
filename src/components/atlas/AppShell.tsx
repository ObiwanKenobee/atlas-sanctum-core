import { ReactNode } from "react";
import { Header } from "./Header";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-6 py-8">{children}</div>
      </main>
      <footer className="border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 h-12 flex items-center justify-between text-[11px] text-muted-foreground">
          <div>Atlas Sanctum Protocol · v0.1 · testnet</div>
          <div className="font-mono">block 19,824,113 · finalized</div>
        </div>
      </footer>
    </div>
  );
}
