import { BarChart2, Award, Zap, TrendingUp, Target } from 'lucide-react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { useExperimentStore } from '../store/useExperimentStore';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const MetricBox = ({ label, value, subtext, highlight, icon: Icon }) => (
  <div className={clsx("p-3 rounded-lg border", highlight ? "bg-[var(--card-bg)] border-[var(--border)] shadow-sm" : "bg-[var(--card-bg)] border-[var(--border)]")}>
    <div className="flex justify-between items-start mb-1">
      <span className="text-xs font-semibold text-[var(--text-secondary)]">{label}</span>
      {Icon && <Icon className={clsx("w-3.5 h-3.5", highlight ? "text-[var(--primary)]" : "text-[var(--text-secondary)]")} />}
    </div>
    <div className="text-lg font-extrabold text-[var(--text-primary)]">{value}</div>
    {subtext && <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">{subtext}</div>}
  </div>
);

MetricBox.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtext: PropTypes.string,
  highlight: PropTypes.bool,
  icon: PropTypes.elementType,
};

export const TelemetryScoreboard = () => {
  const metrics = useExperimentStore((state) => state.metrics);
  const simulationStatus = useExperimentStore((state) => state.simulation.status);

  const formatPercent = (val) => `${(val * 100).toFixed(2)}%`;
  const formatNum = (val) => val.toLocaleString();

  const isWinnerA = metrics.currentWinner.includes('Variant A');
  const isWinnerB = metrics.currentWinner.includes('Variant B');

  return (
    <Card className="h-full">
      <CardHeader title="Live Telemetry" icon={BarChart2} />
      <CardContent>
        <div className="space-y-4">
          
          {/* Winner Banner */}
          <div className={clsx(
            "py-2.5 px-3.5 rounded-lg flex items-center justify-between border",
            isWinnerA ? "bg-[var(--card-bg)] border-[var(--primary)]" : 
            isWinnerB ? "bg-[var(--card-bg)] border-[var(--secondary)]" : 
            "bg-[var(--card-bg)] border-[var(--border)]"
          )}>
            <div className="flex items-center gap-2.5">
              <Award className={clsx(
                "w-5 h-5",
                isWinnerA ? "text-[var(--primary)]" : isWinnerB ? "text-[var(--secondary)]" : "text-[var(--text-secondary)]"
              )} />
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)]">Current Status</div>
                <div className={clsx(
                  "font-extrabold text-sm",
                  isWinnerA ? "text-[var(--primary)]" : isWinnerB ? "text-[var(--secondary)]" : "text-[var(--text-primary)]"
                )}>
                  {metrics.currentWinner}
                </div>
              </div>
            </div>
            {simulationStatus === 'running' && (
              <div className="flex gap-1">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)] opacity-90 animate-pulse"></span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricBox 
              label="Conversions (A)" 
              value={formatNum(metrics.conversionsA)} 
              subtext={`/ ${formatNum(metrics.impressionsA)} visitors`}
            />
            <MetricBox 
              label="Conversion Rate (A)" 
              value={formatPercent(metrics.crA)} 
              icon={Target}
            />
            <MetricBox 
              label="Conversions (B)" 
              value={formatNum(metrics.conversionsB)} 
              subtext={`/ ${formatNum(metrics.impressionsB)} visitors`}
            />
            <MetricBox 
              label="Conversion Rate (B)" 
              value={formatPercent(metrics.crB)} 
              icon={Target}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricBox 
              label="Relative Lift" 
              value={`${metrics.lift > 0 ? '+' : ''}${metrics.lift.toFixed(2)}%`} 
              highlight={metrics.lift > 0}
              icon={TrendingUp}
            />
            <MetricBox 
              label="P-Value" 
              value={metrics.pValue.toFixed(4)} 
              subtext={metrics.pValue < 0.05 ? "Statistically Significant" : "Not Significant"}
            />
            <MetricBox 
              label="Z-Score" 
              value={metrics.zScore.toFixed(2)} 
            />
            <MetricBox 
              label="Freq. Confidence" 
              value={`${metrics.confidence.toFixed(2)}%`} 
              highlight={metrics.confidence >= 95}
              icon={Zap}
            />
          </div>

          <div className="bg-[var(--card-bg)] p-3 rounded-lg border border-[var(--border)]">
            <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Bayesian Probability</h4>
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--primary)] font-semibold">A Beats B</span>
                  <span className="text-[var(--text-primary)] font-bold">{metrics.bayesianProbA.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 border border-slate-800">
                  <div className="bg-[var(--primary)] h-1.5 rounded-full transition-all duration-300" style={{ width: `${metrics.bayesianProbA}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--secondary)] font-semibold">B Beats A</span>
                  <span className="text-[var(--text-primary)] font-bold">{metrics.bayesianProbB.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 border border-slate-800">
                  <div className="bg-[var(--secondary)] h-1.5 rounded-full transition-all duration-300" style={{ width: `${metrics.bayesianProbB}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
};
