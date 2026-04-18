// System Integrity Score breakdown — mock data, shape mirrors what would come
// from on-chain reads against TruthRegistry, ConsensusEngine, and OracleHub.

export interface SISComponent {
  key: string;
  label: string;
  value: number; // 0-100
  weight: number; // 0-1, sum to 1.0
  description: string;
  detail: string;
}

export interface SlashingEvent {
  ts: string;
  validator: string;
  amount: number; // USD
  reason: string;
  txHash: string;
}

export const SIS_COMPONENTS: SISComponent[] = [
  {
    key: "oracle",
    label: "Oracle Uptime",
    value: 98,
    weight: 0.25,
    description: "30-day availability across all registered ImpactOracle endpoints.",
    detail: "All 14 oracles reporting. Last outage: 2025-03-22 (4m, regional CDN).",
  },
  {
    key: "validators",
    label: "Validator Participation",
    value: 89,
    weight: 0.30,
    description: "Share of staked validators submitting attestations within the active epoch.",
    detail: "127 of 142 active validators participated. 15 inactive — 3 epochs to slashing threshold.",
  },
  {
    key: "freshness",
    label: "Attestation Freshness",
    value: 92,
    weight: 0.25,
    description: "Median age of truth attestations across the registry, normalized.",
    detail: "Median attestation age: 6h 12m. SLA target: <24h. 4 assets above 48h, flagged for review.",
  },
  {
    key: "consensus",
    label: "Consensus Health",
    value: 85,
    weight: 0.20,
    description: "Variance between validator submissions on the same attestation window.",
    detail: "Mean inter-validator variance: 4.2 pts. Above 8 pts triggers re-validation.",
  },
];

export const SLASHING_EVENTS: SlashingEvent[] = [
  {
    ts: "2025-04-14T03:12:00Z",
    validator: "0x4b91…2cde",
    amount: 8_400,
    reason: "Submitted attestation outside consensus window (variance 14.2)",
    txHash: "0x91ac…f33d",
  },
  {
    ts: "2025-04-09T17:48:00Z",
    validator: "0xe201…77a0",
    amount: 12_900,
    reason: "Failed challenge on EXT.MIN — counter-claim refuted by consensus",
    txHash: "0x2204…8b1c",
  },
  {
    ts: "2025-04-02T11:30:00Z",
    validator: "0x88de…01ac",
    amount: 3_200,
    reason: "Late attestation (>48h SLA on AQR.SON)",
    txHash: "0x7ff1…aaab",
  },
];
