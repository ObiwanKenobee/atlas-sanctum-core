import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiConfig } from "./lib/atlas/wagmi";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// wagmi + rainbowkit need their own QueryClient at the root.
// App.tsx already wraps inner UI in another QueryClientProvider (existing app code) — that's fine, they nest.
const rootQueryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={rootQueryClient}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: "hsl(172 50% 52%)",
          accentColorForeground: "hsl(220 26% 8%)",
          borderRadius: "small",
          fontStack: "system",
          overlayBlur: "small",
        })}
      >
        <App />
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
