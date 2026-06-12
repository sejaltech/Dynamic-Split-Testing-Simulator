import React from 'react';
import './App.css';
import { ExperimentSetup } from './components/ExperimentSetup';
import { SimulationControls } from './components/SimulationControls';
import { TelemetryScoreboard } from './components/TelemetryScoreboard';
import { VariantVisualizer } from './components/VariantVisualizer';
import { AnalyticsStage } from './components/AnalyticsStage';
import { ExportImport } from './components/ExportImport';
import { Beaker } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-app-bg text-primary p-6 font-sans">
      <div className="app-shell mx-auto">
        {/* Main content */}
        <main className="flex-1">
          <div className="max-w-[1200px] mx-auto space-y-6">
            <header className="app-header mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-transparent p-1 rounded">
                  <Beaker className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <div className="brand-title">
                  <h1 className="text-xl md:text-2xl font-extrabold">Dynamic Split-Testing Simulator</h1>
                  <p className="text-secondary text-xs md:text-sm font-medium">Monte Carlo A/B Testing & Bayesian Analysis Platform</p>
                </div>
              </div>
              <ExportImport />
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-8 space-y-6 flex flex-col">
                <ExperimentSetup />
                <AnalyticsStage />
              </div>

              <div className="xl:col-span-4 space-y-6 flex flex-col">
                <SimulationControls />
                <div className="flex-1 min-h-[400px]">
                  <VariantVisualizer />
                </div>
              </div>
            </div>

            <TelemetryScoreboard />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
