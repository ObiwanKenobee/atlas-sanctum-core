import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, base, baseSepolia, mainnet, optimism, sepolia } from "wagmi/chains";

// WalletConnect Cloud projectId. Get one free at https://cloud.walletconnect.com.
// This is a publishable identifier — safe to commit. Replace with your own when ready.
const WALLETCONNECT_PROJECT_ID =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_WALLETCONNECT_PROJECT_ID ||
  "atlas_sanctum_dev_placeholder";

export const wagmiConfig = getDefaultConfig({
  appName: "Atlas Sanctum",
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [mainnet, sepolia, base, baseSepolia, arbitrum, optimism],
  ssr: false,
});
