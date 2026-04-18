import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronDown, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Doctrine-styled wrapper around RainbowKit's ConnectButton.
 * - Shows "Connect Wallet" when disconnected
 * - Shows ENS name (or truncated address) + chain switcher when connected
 * - Surfaces wrong-network state in the violation tone (red is reserved for protocol failures)
 */
export function WalletButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            aria-hidden={!ready}
            className={cn("flex items-center gap-2", !ready && "opacity-0 pointer-events-none select-none")}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="px-3 py-1.5 text-[12px] rounded-sm border border-border-strong bg-surface-elevated text-foreground hover:bg-surface-overlay transition-colors inline-flex items-center gap-1.5"
                  >
                    <Wallet className="h-3.5 w-3.5" />
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="px-3 py-1.5 text-[12px] rounded-sm border border-violation/40 bg-violation-muted text-violation hover:bg-violation-muted/70 transition-colors"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <>
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="px-2.5 py-1.5 text-[11px] rounded-sm border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors inline-flex items-center gap-1.5"
                    title={`Connected to ${chain.name}`}
                  >
                    {chain.hasIcon && chain.iconUrl && (
                      <img
                        src={chain.iconUrl}
                        alt={chain.name}
                        className="h-3.5 w-3.5 rounded-full"
                        style={{ background: chain.iconBackground }}
                      />
                    )}
                    <span className="hidden sm:inline">{chain.name}</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="px-3 py-1.5 text-[12px] rounded-sm border border-truth/40 bg-truth-muted text-truth hover:bg-truth-muted/70 transition-colors metric"
                  >
                    {account.ensName ?? account.displayName}
                    {account.displayBalance ? (
                      <span className="ml-2 text-[11px] text-truth/70">{account.displayBalance}</span>
                    ) : null}
                  </button>
                </>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
