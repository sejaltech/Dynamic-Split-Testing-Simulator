import { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { useExperimentStore } from '../store/useExperimentStore';
import { calculateCR, calculateLift, calculateStandardError, calculateZScore, calculatePValue, calculateConfidence, getConfidenceMessage } from '../utils/statistics';
import { calculateBayesianMetrics } from '../utils/bayesian';
import clsx from 'clsx';

export const SimulationControls = () => {
  const store = useExperimentStore();
  const workerRef = useRef(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/simulationWorker.js', import.meta.url), { type: 'module' });

    workerRef.current.onmessage = (e) => {
      const { type, metrics, currentVisitors } = e.data;
      
      if (type === 'UPDATE' || type === 'COMPLETED' || type === 'PAUSED') {
        const { impressionsA, conversionsA, impressionsB, conversionsB } = metrics;
        
        const crA = calculateCR(conversionsA, impressionsA);
        const crB = calculateCR(conversionsB, impressionsB);
        const lift = calculateLift(crA, crB);
        const seA = calculateStandardError(crA, impressionsA);
        const seB = calculateStandardError(crB, impressionsB);
        const zScore = calculateZScore(crA, crB, seA, seB);
        const pValue = calculatePValue(zScore);
        const confidence = calculateConfidence(zScore);
        const bayesian = calculateBayesianMetrics(impressionsA, conversionsA, impressionsB, conversionsB);
        const currentWinner = getConfidenceMessage(confidence, impressionsA, impressionsB, crA, crB);

        const newMetrics = {
          ...metrics,
          crA, crB, lift, standardError: seB, zScore, pValue, confidence,
          bayesianProbA: bayesian.probABeatsB,
          bayesianProbB: bayesian.probBBeatsA,
          currentWinner,
        };

        store.setCurrentVisitors(currentVisitors);
        store.updateMetrics(newMetrics);
        
        const currentTarget = store.simulation.targetVisitors;
        const chartUpdateInterval = Math.max(10, Math.floor(currentTarget / 50));
        
        // Use store.getState() to avoid dependency issues if needed, but here we can just update
        if (currentVisitors % chartUpdateInterval === 0 || type === 'COMPLETED') {
          useExperimentStore.getState().appendChartData({
            visitors: currentVisitors,
            crA: crA * 100,
            crB: crB * 100,
            confidence,
            bayesianA: bayesian.probABeatsB,
            bayesianB: bayesian.probBBeatsA,
            lift
          });
        }

        if (type === 'COMPLETED') {
          store.setSimulationStatus('completed');
        }
      }
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const handleStart = () => {
    store.resetSimulation();
    store.setSimulationStatus('running');
    workerRef.current.postMessage({
      type: 'START',
      payload: { config: { ...store.config, speed: store.simulation.speed }, targetVisitors: store.simulation.targetVisitors }
    });
  };

  const handlePause = () => {
    store.setSimulationStatus('paused');
    workerRef.current.postMessage({ type: 'PAUSE' });
  };

  const handleResume = () => {
    store.setSimulationStatus('running');
    workerRef.current.postMessage({ type: 'RESUME' });
  };

  const handleReset = () => {
    store.resetSimulation();
    workerRef.current.postMessage({ type: 'RESET' });
  };

  const { status, speed, targetVisitors, currentVisitors } = store.simulation;
  const progress = targetVisitors > 0 ? (currentVisitors / targetVisitors) * 100 : 0;

  return (
    <Card>
      <CardHeader title="Simulation Engine" icon={Activity} />
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Visitor Target</label>
              <select 
                value={targetVisitors}
                onChange={(e) => store.setTargetVisitors(parseInt(e.target.value))}
                disabled={status === 'running' || status === 'paused'}
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded px-2.5 py-1.5 text-xs outline-none disabled:opacity-50 text-[var(--text-primary)]"
              >
                <option value={1000}>1,000</option>
                <option value={10000}>10,000</option>
                <option value={100000}>100,000</option>
                <option value={1000000}>1,000,000</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Simulation Speed</label>
              <select 
                value={speed}
                onChange={(e) => store.setSimulationSpeed(parseInt(e.target.value))}
                disabled={status === 'running'}
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded px-2.5 py-1.5 text-xs outline-none disabled:opacity-50 text-[var(--text-primary)]"
              >
                <option value={1}>1x Speed</option>
                <option value={10}>10x Speed</option>
                <option value={100}>100x Speed</option>
                <option value={1000}>1000x Speed</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Progress</span>
              <span className="font-bold text-slate-100">{currentVisitors.toLocaleString()} / {targetVisitors.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
              <div 
                className={clsx(
                  "h-3 rounded-full transition-all duration-300", 
                  status === 'running' ? "bg-[var(--primary)]" : status === 'completed' ? "bg-[var(--success)]" : "bg-[var(--muted)]"
                )}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex gap-2.5 pt-1">
            {status === 'idle' && (
              <button onClick={handleStart} className="flex-1 bg-[var(--primary)] hover:brightness-95 text-[var(--bg)] py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-bold text-xs">
                <Play className="w-3.5 h-3.5 fill-current" /> Start
              </button>
            )}
            
            {status === 'running' && (
              <button onClick={handlePause} className="flex-1 bg-[var(--warning)] hover:brightness-95 text-[var(--text-primary)] py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-bold text-xs">
                <Pause className="w-3.5 h-3.5 fill-current" /> Pause
              </button>
            )}

            {status === 'paused' && (
              <button onClick={handleResume} className="flex-1 bg-[var(--success)] hover:brightness-95 text-[var(--text-primary)] py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-bold text-xs">
                <Play className="w-3.5 h-3.5 fill-current" /> Resume
              </button>
            )}

            {(status === 'completed' || status === 'paused') && (
              <button onClick={handleReset} className="flex-1 bg-[var(--card-bg)] hover:brightness-95 text-[var(--text-primary)] py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-bold text-xs border border-[var(--border)]">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
