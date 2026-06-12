export async function fetchJson(url, opts = {}) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error('Network error');
  return res.json();
}

// Mock experiment simulation utility (used by workers or dev mode)
export function simulateTrafficStep({ impressionsA, conversionsA, impressionsB, conversionsB, config }) {
  // simple bernoulli step
  const newImpressionsA = impressionsA + Math.round(config.trafficAllocation / 100);
  const newImpressionsB = impressionsB + Math.round((100 - config.trafficAllocation) / 100);
  const convA = Math.random() < config.conversionProbabilityA / 100 ? 1 : 0;
  const convB = Math.random() < config.conversionProbabilityB / 100 ? 1 : 0;

  return {
    impressionsA: newImpressionsA,
    conversionsA: conversionsA + convA,
    impressionsB: newImpressionsB,
    conversionsB: conversionsB + convB,
  };
}
