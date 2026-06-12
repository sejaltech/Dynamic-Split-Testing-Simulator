import React from 'react';
import { ExperimentSetup } from '../components/ExperimentSetup';
import { AnalyticsStage } from '../components/AnalyticsStage';
import { SimulationControls } from '../components/SimulationControls';
import { VariantVisualizer } from '../components/VariantVisualizer';
import { TelemetryScoreboard } from '../components/TelemetryScoreboard';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <ExperimentSetup />
          <AnalyticsStage />
        </div>
        <div className="xl:col-span-4 space-y-6">
          <SimulationControls />
          <VariantVisualizer />
        </div>
      </div>
      <TelemetryScoreboard />
    </div>
  );
}
