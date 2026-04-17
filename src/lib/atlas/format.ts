export const fmtUSD = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n.toFixed(0)}`;
};
export const fmtPct = (n: number, d = 1) => `${n.toFixed(d)}%`;
export const fmtScore = (n: number) => n.toFixed(0);
