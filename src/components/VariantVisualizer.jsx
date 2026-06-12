import { useEffect, useState } from 'react';
import { Monitor } from 'lucide-react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { useExperimentStore } from '../store/useExperimentStore';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const MockLandingPage = ({ variant, variantColor, isActive }) => {
  const [showConversion, setShowConversion] = useState(false);
  const simulationStatus = useExperimentStore(state => state.simulation.status);

  useEffect(() => {
    if (simulationStatus !== 'running') return;
    const interval = setInterval(() => {
      if (Math.random() < 0.15) {
        setShowConversion(true);
        setTimeout(() => setShowConversion(false), 600);
      }
    }, 1500 + Math.random() * 1500);
    return () => clearInterval(interval);
  }, [simulationStatus]);

  const ctaColor = variant.buttonColor || variantColor || '#10B981';

  return (
    <div className={clsx('mock-card', isActive ? 'highlight' : '')}>
      <div className="mock-card-body">
        {/* Brand */}
        <span className="mock-brand">AcmeCorp</span>

        {/* Headline */}
        <h2 className="mock-title" style={{ fontSize: variant.fontSize }}>
          {variant.headerText}
        </h2>

        {/* Subtext */}
        <p className="mock-lead">
          Optimize your team&apos;s workflow and boost efficiency today.
        </p>

        {/* CTA */}
        <div className="relative">
          <button
            className={clsx(
              'mock-cta',
              showConversion && 'opacity-90'
            )}
            style={{ backgroundColor: ctaColor }}
          >
            {variant.ctaText}
          </button>
          {showConversion && (
            <span
              className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-bold select-none"
              style={{ color: variantColor }}
            >
              +1
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

MockLandingPage.propTypes = {
  variant: PropTypes.object.isRequired,
  variantColor: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
};

export const VariantVisualizer = () => {
  const config = useExperimentStore((state) => state.config);
  const metrics = useExperimentStore((state) => state.metrics);

  const totalImpressions = metrics.impressionsA + metrics.impressionsB;
  const aRatio = totalImpressions === 0
    ? config.trafficAllocation
    : (metrics.impressionsA / totalImpressions) * 100;
  const bRatio = totalImpressions === 0
    ? (100 - config.trafficAllocation)
    : (metrics.impressionsB / totalImpressions) * 100;

  return (
    <Card className="h-full">
      <CardHeader title="Live Visitor Split Visualization" icon={Monitor} />
      <CardContent className="flex flex-col h-full">

        {/* Traffic split bar — subtle, thin, with labels above */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5 text-[11px] font-medium">
            <span style={{ color: '#10B981' }}>{config.variantA.name} — {aRatio.toFixed(1)}%</span>
            <span style={{ color: '#8B5CF6' }}>{config.variantB.name} — {bRatio.toFixed(1)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${aRatio}%`, background: '#10B981' }}
            />
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${bRatio}%`, background: '#8B5CF6' }}
            />
          </div>
        </div>

        {/* Side-by-side previews */}
        <div className="previews flex gap-3.5 items-stretch">
          <div className="preview-card flex-1 min-w-0">
            <MockLandingPage
              variant={config.variantA}
              variantColor="#10B981"
              isActive={true}
            />
          </div>
          <div className="preview-card flex-1 min-w-0">
            <MockLandingPage
              variant={config.variantB}
              variantColor="#8B5CF6"
              isActive={true}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

