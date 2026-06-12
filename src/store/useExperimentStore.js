import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultVariantA = {
  name: 'Variant A',
  headerText: 'Boost Your Productivity',
  ctaText: 'Start Free Trial',
  buttonColor: 'var(--primary)',
  fontSize: '16px',
};

const defaultVariantB = {
  name: 'Variant B',
  headerText: 'Supercharge Your Workflow',
  ctaText: 'Get Started Now',
  buttonColor: 'var(--secondary)',
  fontSize: '16px',
};

export const useExperimentStore = create(
  persist(
    (set) => ({
      // --- Experiment Configuration ---
      config: {
        variantA: { ...defaultVariantA },
        variantB: { ...defaultVariantB },
        trafficAllocation: 50, // % to Variant A
        conversionProbabilityA: 5.0, // % true underlying CR
        conversionProbabilityB: 5.5, // % true underlying CR
      },
  
  // Actions
  updateConfig: (updates) => set((state) => ({ config: { ...state.config, ...updates } })),
  updateVariantA: (updates) => set((state) => ({ config: { ...state.config, variantA: { ...state.config.variantA, ...updates } } })),
  updateVariantB: (updates) => set((state) => ({ config: { ...state.config, variantB: { ...state.config.variantB, ...updates } } })),

  // --- Simulation State ---
  simulation: {
    status: 'idle', // 'idle', 'running', 'paused', 'completed'
    speed: 1, // 1x, 10x, 100x, 1000x
    targetVisitors: 10000,
    currentVisitors: 0,
  },

  setSimulationStatus: (status) => set((state) => ({ simulation: { ...state.simulation, status } })),
  setSimulationSpeed: (speed) => set((state) => ({ simulation: { ...state.simulation, speed } })),
  setTargetVisitors: (targetVisitors) => set((state) => ({ simulation: { ...state.simulation, targetVisitors } })),
  setCurrentVisitors: (currentVisitors) => set((state) => ({ simulation: { ...state.simulation, currentVisitors } })),

  // --- Metrics State ---
  metrics: {
    impressionsA: 0,
    conversionsA: 0,
    impressionsB: 0,
    conversionsB: 0,
    crA: 0,
    crB: 0,
    lift: 0,
    standardError: 0,
    zScore: 0,
    pValue: 1,
    confidence: 0,
    bayesianProbA: 0.5,
    bayesianProbB: 0.5,
    currentWinner: 'Too Close To Call',
  },
  
  updateMetrics: (newMetrics) => set((state) => ({ metrics: { ...state.metrics, ...newMetrics } })),

  // --- Chart Data ---
  chartData: [],
  appendChartData: (dataPoint) => set((state) => ({ chartData: [...state.chartData, dataPoint] })),
  setChartData: (data) => set(() => ({ chartData: data })),
  
  // --- Reset ---
  resetSimulation: () => set((state) => ({
    simulation: { ...state.simulation, status: 'idle', currentVisitors: 0 },
    metrics: {
      impressionsA: 0, conversionsA: 0, impressionsB: 0, conversionsB: 0,
      crA: 0, crB: 0, lift: 0, standardError: 0, zScore: 0, pValue: 1, confidence: 0,
      bayesianProbA: 0.5, bayesianProbB: 0.5, currentWinner: 'Too Close To Call',
    },
    chartData: [],
  })),
}), {
  name: 'ab-testing-simulator-storage',
  partialize: (state) => ({
    config: state.config,
    metrics: state.metrics,
    chartData: state.chartData,
    simulation: {
      ...state.simulation,
      status: state.simulation.status === 'running' ? 'paused' : state.simulation.status,
    }
  })
}));
