/**
 * src/utils/bayesian.js
 * 
 * Bayesian Analysis Engine for A/B Testing
 * Uses Beta distribution conjugate prior approach.
 * Prior: Beta(1, 1) - Uniform prior
 */

import { normalCDF } from './statistics';

export const calculateBayesianMetrics = (impressionsA, conversionsA, impressionsB, conversionsB) => {
  // Posterior for A: Beta(a1, b1)
  const a1 = 1 + conversionsA;
  const b1 = 1 + impressionsA - conversionsA;

  // Posterior for B: Beta(a2, b2)
  const a2 = 1 + conversionsB;
  const b2 = 1 + impressionsB - conversionsB;

  // Mean and Variance of Beta distributions
  const mu1 = a1 / (a1 + b1);
  const var1 = (a1 * b1) / (Math.pow(a1 + b1, 2) * (a1 + b1 + 1));

  const mu2 = a2 / (a2 + b2);
  const var2 = (a2 * b2) / (Math.pow(a2 + b2, 2) * (a2 + b2 + 1));

  // Normal approximation for the difference of two Beta distributions
  // This is highly accurate for large sample sizes (which we have in this simulator)
  // Let D = Beta(a2, b2) - Beta(a1, b1) ~ Normal(mu2 - mu1, var1 + var2)
  const meanDiff = mu2 - mu1;
  const varDiff = var1 + var2;
  
  if (varDiff === 0) {
    return { probBBeatsA: 0.5, probABeatsB: 0.5 };
  }

  const z = meanDiff / Math.sqrt(varDiff);
  
  // P(D > 0) is the probability that B > A
  const probBBeatsA = normalCDF(z);
  const probABeatsB = 1 - probBBeatsA;

  return {
    probBBeatsA: probBBeatsA * 100,
    probABeatsB: probABeatsB * 100,
  };
};
