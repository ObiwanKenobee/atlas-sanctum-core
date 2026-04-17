import { Asset } from "./types";

export const ASSETS: Asset[] = [
  {
    id: "rgn-soil-01",
    name: "Regenerative Soil Carbon Pool — Andes",
    ticker: "RSC.AND",
    category: "Land Regeneration",
    truthScore: 94,
    impactScore: 88,
    status: "verified",
    expectedReturn: 7.2,
    truthYield: 5.8,
    totalAllocated: 18_420_000,
    truth: {
      sources: [
        { name: "Sentinel-2 Satellite NDVI", weight: 0.35, status: "verified" },
        { name: "Field Sensor Mesh (412 nodes)", weight: 0.30, status: "verified" },
        { name: "Independent Soil Lab — Quito", weight: 0.20, status: "verified" },
        { name: "Community Cooperative Filings", weight: 0.15, status: "verified" },
      ],
      validatorConsensus: 96,
      confidence: 93,
      validators: 41,
    },
    impact: {
      environmental: 92,
      social: 84,
      resilience: 88,
      summary: "Sequesters 2.1t CO₂e per hectare/yr, restores topsoil microbiome, supports 1,240 farmer households.",
    },
    audit: [
      { ts: "2025-04-12T09:14:00Z", event: "Truth attestation finalized", actor: "TruthRegistry", hash: "0x7a3f…b21e" },
      { ts: "2025-04-08T14:02:00Z", event: "Validator consensus reached", actor: "ConsensusEngine", hash: "0x91cd…40a7" },
      { ts: "2025-03-29T11:30:00Z", event: "Impact oracle updated", actor: "ImpactOracle", hash: "0x55ae…ff10" },
      { ts: "2025-03-15T08:00:00Z", event: "Asset registered", actor: "AssetRegistry", hash: "0x12bb…ee99" },
    ],
    thesis: "A regenerative soil pool whose returns are bound to measurable ecological restoration. Capital here regenerates the substrate it depends on.",
  },
  {
    id: "grid-mesh-02",
    name: "Distributed Grid Resilience Mesh — Kerala",
    ticker: "DGR.KER",
    category: "Energy Infrastructure",
    truthScore: 87,
    impactScore: 81,
    status: "verified",
    expectedReturn: 8.4,
    truthYield: 6.1,
    totalAllocated: 9_870_000,
    truth: {
      sources: [
        { name: "Grid Telemetry Stream", weight: 0.40, status: "verified" },
        { name: "Municipal Energy Audit", weight: 0.25, status: "verified" },
        { name: "Independent Engineer Review", weight: 0.20, status: "verified" },
        { name: "Community Usage Reports", weight: 0.15, status: "review" },
      ],
      validatorConsensus: 88,
      confidence: 84,
      validators: 28,
    },
    impact: {
      environmental: 78,
      social: 86,
      resilience: 92,
      summary: "Reduces blackout exposure for 84,000 residents, displaces 3.2 GWh diesel generation/yr.",
    },
    audit: [
      { ts: "2025-04-10T18:00:00Z", event: "Truth attestation finalized", actor: "TruthRegistry", hash: "0x88de…01ac" },
      { ts: "2025-04-02T10:11:00Z", event: "Validator review opened", actor: "ConsensusEngine", hash: "0x44a1…77be" },
      { ts: "2025-03-20T07:20:00Z", event: "Asset registered", actor: "AssetRegistry", hash: "0x9912…aa01" },
    ],
    thesis: "Returns scale with measurable grid uptime and avoided emissions. Capital aligned with infrastructural antifragility.",
  },
  {
    id: "water-aq-03",
    name: "Aquifer Recharge Bond — Sonoran",
    ticker: "AQR.SON",
    category: "Water Systems",
    truthScore: 71,
    impactScore: 79,
    status: "review",
    expectedReturn: 6.0,
    truthYield: 4.2,
    totalAllocated: 4_120_000,
    truth: {
      sources: [
        { name: "Hydrology Model v3.2", weight: 0.45, status: "review" },
        { name: "USGS Well Data", weight: 0.30, status: "verified" },
        { name: "Operator Self-Report", weight: 0.25, status: "review" },
      ],
      validatorConsensus: 68,
      confidence: 64,
      validators: 17,
    },
    impact: {
      environmental: 82,
      social: 74,
      resilience: 80,
      summary: "Projected aquifer recharge of 11M m³/yr; pending field calibration before full attestation.",
    },
    audit: [
      { ts: "2025-04-11T12:00:00Z", event: "Validator flagged inconsistency", actor: "Validator 0x7f…2a", hash: "0x66cc…1199" },
      { ts: "2025-04-05T09:00:00Z", event: "Asset registered", actor: "AssetRegistry", hash: "0x7711…ddbb" },
    ],
    thesis: "Strong impact thesis pending data reconciliation. Allocation gated until consensus exceeds threshold.",
  },
  {
    id: "ext-min-04",
    name: "Conventional Extraction Index Token",
    ticker: "EXT.MIN",
    category: "Extractive",
    truthScore: 22,
    impactScore: 14,
    status: "rejected",
    expectedReturn: 11.8,
    truthYield: 0,
    totalAllocated: 0,
    truth: {
      sources: [
        { name: "Issuer Disclosure", weight: 0.60, status: "rejected" },
        { name: "Third-party ESG Rating", weight: 0.40, status: "review" },
      ],
      validatorConsensus: 24,
      confidence: 31,
      validators: 9,
    },
    impact: {
      environmental: 8,
      social: 22,
      resilience: 18,
      summary: "Net-degenerative. Fails doctrine on regeneration and long-term viability.",
    },
    audit: [
      { ts: "2025-04-01T00:00:00Z", event: "Doctrine check failed", actor: "AllocationEngine", hash: "0xdead…beef" },
    ],
    thesis: "High nominal return, negative regenerative outcome. Capital flow blocked by protocol.",
  },
  {
    id: "for-mng-05",
    name: "Mangrove Coastal Defense — Sundarbans",
    ticker: "MNG.SUN",
    category: "Coastal Resilience",
    truthScore: 91,
    impactScore: 94,
    status: "verified",
    expectedReturn: 6.8,
    truthYield: 6.4,
    totalAllocated: 22_640_000,
    truth: {
      sources: [
        { name: "LiDAR Canopy Survey", weight: 0.40, status: "verified" },
        { name: "Marine Biology Consortium", weight: 0.30, status: "verified" },
        { name: "Local Stewards Network", weight: 0.30, status: "verified" },
      ],
      validatorConsensus: 94,
      confidence: 91,
      validators: 36,
    },
    impact: {
      environmental: 95,
      social: 90,
      resilience: 96,
      summary: "Protects 312 km of coastline; sequesters 4.6t CO₂e/ha/yr; sustains fisheries for 28,000 people.",
    },
    audit: [
      { ts: "2025-04-13T06:00:00Z", event: "Capital allocation: $2.1M", actor: "AllocationEngine", hash: "0xa1b2…c3d4" },
      { ts: "2025-04-09T15:00:00Z", event: "Truth attestation finalized", actor: "TruthRegistry", hash: "0x55ff…aa11" },
      { ts: "2025-03-22T10:00:00Z", event: "Asset registered", actor: "AssetRegistry", hash: "0x33aa…99cc" },
    ],
    thesis: "Among the highest-confidence regenerative pools in the registry. Returns derive from measurable ecological and social yield.",
  },
];

export const RECENT_ALLOCATIONS = [
  { ts: "2m ago", asset: "MNG.SUN", amount: 2_100_000, actor: "0x7a…f3" },
  { ts: "14m ago", asset: "RSC.AND", amount: 540_000, actor: "0x21…b9" },
  { ts: "38m ago", asset: "DGR.KER", amount: 1_200_000, actor: "0xc4…0e" },
  { ts: "1h ago", asset: "MNG.SUN", amount: 880_000, actor: "0x09…aa" },
  { ts: "2h ago", asset: "RSC.AND", amount: 310_000, actor: "0x55…71" },
  { ts: "3h ago", asset: "DGR.KER", amount: 460_000, actor: "0x82…3c" },
];

export const PORTFOLIO = {
  totalValue: 4_812_400,
  truthYield: 6.1,
  regenerativeAlpha: 2.4,
  ethicalLiquidityScore: 88,
  holdings: [
    { assetId: "rgn-soil-01", value: 1_820_000, truthTrend: +2, impact: 88, alert: null as string | null },
    { assetId: "for-mng-05", value: 1_640_000, truthTrend: +1, impact: 94, alert: null },
    { assetId: "grid-mesh-02", value: 980_000, truthTrend: 0, impact: 81, alert: null },
    { assetId: "water-aq-03", value: 372_400, truthTrend: -3, impact: 79, alert: "Truth score declining — under review" },
  ],
};

export const VALIDATOR = {
  address: "0x7a91…f3c2",
  stake: 142_000,
  reputation: 87,
  pending: ["water-aq-03", "grid-mesh-02"],
};

export const SYSTEM_INTEGRITY_SCORE = 91;
