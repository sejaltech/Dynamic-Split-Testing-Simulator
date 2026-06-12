import PropTypes from 'prop-types';
import { Settings } from 'lucide-react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { useExperimentStore } from '../store/useExperimentStore';

const VariantConfig = ({ title, variant, onChange, conversionProb, onConversionProbChange }) => {
  return (
    <div className="space-y-2.5">
      <h4 className="font-semibold text-xs text-slate-300 border-b border-slate-700 pb-1.5 uppercase tracking-wider">{title}</h4>
      
      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-400">Variant Name</label>
        <input 
          type="text" 
          value={variant.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="w-full bg-slate-900/60 border border-slate-700/60 rounded px-2.5 py-1.5 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-slate-100"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-400">Header Text</label>
        <input 
          type="text" 
          value={variant.headerText}
          onChange={(e) => onChange({ headerText: e.target.value })}
          className="w-full bg-slate-900/60 border border-slate-700/60 rounded px-2.5 py-1.5 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-slate-100"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-400">CTA Text</label>
        <input 
          type="text" 
          value={variant.ctaText}
          onChange={(e) => onChange({ ctaText: e.target.value })}
          className="w-full bg-slate-900/60 border border-slate-700/60 rounded px-2.5 py-1.5 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-slate-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-400">Button Color</label>
          <div className="flex items-center gap-2">
            <input 
              type="color" 
              value={variant.buttonColor}
              onChange={(e) => onChange({ buttonColor: e.target.value })}
              className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
            />
            <span className="text-[10px] font-mono text-slate-400 uppercase">{variant.buttonColor}</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-400">Font Size</label>
          <select 
            value={variant.fontSize}
            onChange={(e) => onChange({ fontSize: e.target.value })}
            className="w-full bg-slate-900/60 border border-slate-700/60 rounded px-2.5 py-1.5 text-xs outline-none text-slate-100"
          >
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
          </select>
        </div>
      </div>

      <div className="space-y-1 pt-1">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-medium text-slate-400">True Conversion Rate</label>
          <span className="text-xs font-bold text-blue-400">{conversionProb.toFixed(1)}%</span>
        </div>
        <input 
          type="range" 
          min="0.1" max="25" step="0.1"
          value={conversionProb}
          onChange={(e) => onConversionProbChange(parseFloat(e.target.value))}
          className="w-full accent-blue-500 cursor-pointer h-1 bg-slate-700 rounded-lg appearance-none"
        />
      </div>
    </div>
  );
};

VariantConfig.propTypes = {
  title: PropTypes.string.isRequired,
  variant: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  conversionProb: PropTypes.number.isRequired,
  onConversionProbChange: PropTypes.func.isRequired
};

export const ExperimentSetup = () => {
  const config = useExperimentStore((state) => state.config);
  const updateConfig = useExperimentStore((state) => state.updateConfig);
  const updateVariantA = useExperimentStore((state) => state.updateVariantA);
  const updateVariantB = useExperimentStore((state) => state.updateVariantB);
  const simulationStatus = useExperimentStore((state) => state.simulation.status);
  
  const isDisabled = simulationStatus === 'running' || simulationStatus === 'paused';

  return (
    <Card className={isDisabled ? "opacity-75 pointer-events-none transition-opacity" : ""}>
      <CardHeader title="Experiment Configuration" icon={Settings} />
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2 bg-slate-900/40 p-3 rounded-lg border border-slate-700/40">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Traffic Split</label>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                  {config.variantA.name}: {config.trafficAllocation}%
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-950/60 text-purple-400 border border-purple-800/50">
                  {config.variantB.name}: {100 - config.trafficAllocation}%
                </span>
              </div>
            </div>
            <input 
              type="range" 
              min="1" max="99" 
              value={config.trafficAllocation}
              onChange={(e) => updateConfig({ trafficAllocation: parseInt(e.target.value) })}
              style={{
                background: `linear-gradient(to right, #10B981 ${config.trafficAllocation}%, #1E3448 ${config.trafficAllocation}%)`
              }}
              className="traffic-slider w-full cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <VariantConfig 
              title="Variant A Settings"
              variant={config.variantA}
              onChange={updateVariantA}
              conversionProb={config.conversionProbabilityA}
              onConversionProbChange={(val) => updateConfig({ conversionProbabilityA: val })}
            />
            <VariantConfig 
              title="Variant B Settings"
              variant={config.variantB}
              onChange={updateVariantB}
              conversionProb={config.conversionProbabilityB}
              onConversionProbChange={(val) => updateConfig({ conversionProbabilityB: val })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
