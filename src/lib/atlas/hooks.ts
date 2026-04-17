// Stub contract hooks — shaped like wagmi's useContractRead/useContractWrite.
// Swap implementations with real wagmi calls when ABIs are available.
import { useEffect, useState } from "react";
import { ASSETS, PORTFOLIO, RECENT_ALLOCATIONS, SYSTEM_INTEGRITY_SCORE, VALIDATOR } from "./mock";
import { Asset } from "./types";

type ReadState<T> = { data: T | undefined; isLoading: boolean; error: Error | null };

function useFakeRead<T>(value: T, delay = 220): ReadState<T> {
  const [state, setState] = useState<ReadState<T>>({ data: undefined, isLoading: true, error: null });
  useEffect(() => {
    const t = setTimeout(() => setState({ data: value, isLoading: false, error: null }), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return state;
}

// AssetRegistry.listAssets()
export const useAssetRegistry = () => useFakeRead<Asset[]>(ASSETS);

// AssetRegistry.getAsset(id)
export const useAsset = (id: string | undefined) =>
  useFakeRead<Asset | undefined>(ASSETS.find((a) => a.id === id));

// TruthRegistry.getSystemIntegrityScore()
export const useSystemIntegrity = () => useFakeRead<number>(SYSTEM_INTEGRITY_SCORE, 120);

// AllocationEngine.recentFlows()
export const useCapitalFlow = () => useFakeRead(RECENT_ALLOCATIONS, 180);

// Portfolio aggregator
export const usePortfolio = () => useFakeRead(PORTFOLIO, 220);

// Validator profile
export const useValidator = () => useFakeRead(VALIDATOR, 120);

// AllocationEngine.allocate(assetId, amount)
export function useAllocate() {
  const [isPending, setPending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const allocate = async (assetId: string, amount: number) => {
    setPending(true);
    await new Promise((r) => setTimeout(r, 1200));
    const hash = "0x" + Math.random().toString(16).slice(2, 10) + "…" + Math.random().toString(16).slice(2, 6);
    setTxHash(hash);
    setPending(false);
    return { hash, assetId, amount };
  };
  return { allocate, isPending, txHash };
}

// TruthRegistry.submitValidation(assetId, scores)
export function useSubmitValidation() {
  const [isPending, setPending] = useState(false);
  const submit = async (_assetId: string, _payload: unknown) => {
    setPending(true);
    await new Promise((r) => setTimeout(r, 900));
    setPending(false);
    return { ok: true };
  };
  return { submit, isPending };
}
