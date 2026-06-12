/**
 * src/utils/statistics.js
 * 
 * Frequentist Statistics Engine for A/B Testing
 */

export const calculateCR = (conversions, impressions) => {
  if (impressions === 0) return 0;
  return conversions / impressions;
};

export const calculateLift = (crA, crB) => {
  if (crA === 0) return 0;
  return ((crB - crA) / crA) * 100;
};

export const calculateStandardError = (cr, impressions) => {
  if (impressions === 0) return 0;
  return Math.sqrt((cr * (1 - cr)) / impressions);
};

export const calculateZScore = (crA, crB, seA, seB) => {
  if (seA === 0 && seB === 0) return 0;
  return (crB - crA) / Math.sqrt(Math.pow(seA, 2) + Math.pow(seB, 2));
};

// Approximation of CDF for standard normal distribution
export const normalCDF = (z) => {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
};

export const calculatePValue = (z) => {
  return 2 * (1 - normalCDF(Math.abs(z)));
};

export const calculateConfidence = (z) => {
  // One-sided confidence
  return normalCDF(Math.abs(z)) * 100;
};

export const getConfidenceMessage = (confidence, impressionsA, impressionsB, crA, crB) => {
  const totalImpressions = impressionsA + impressionsB;
  if (totalImpressions < 1000) return "Not Enough Data";
  
  if (confidence >= 95) {
    const winner = crB > crA ? "Variant B" : "Variant A";
    return `Statistical Winner Detected: ${winner} is winning with ${confidence.toFixed(1)}% confidence.`;
  }
  
  if (confidence >= 90) return "Confidence Achieved (Moderate)";
  if (confidence >= 80) return "Moderate Confidence";
  
  return "Low Confidence";
};
