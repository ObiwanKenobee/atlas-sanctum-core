export type AssetStatus = "verified" | "review" | "rejected";

export interface Asset {
  id: string;
  name: string;
  ticker: string;
  category: string;
  truthScore: number;       // 0-100
  impactScore: number;      // 0-100
  status: AssetStatus;
  expectedReturn: number;   // % annualized
  truthYield: number;       // % regenerative yield
  totalAllocated: number;   // USD
  truth: {
    sources: { name: string; weight: number; status: AssetStatus }[];
    validatorConsensus: number; // 0-100
    confidence: number;         // 0-100
    validators: number;
  };
  impact: {
    environmental: number;
    social: number;
    resilience: number;
    summary: string;
  };
  audit: { ts: string; event: string; actor: string; hash: string }[];
  thesis: string;
}

export interface Allocation {
  assetId: string;
  amount: number;
  ts: string;
  txHash: string;
}
