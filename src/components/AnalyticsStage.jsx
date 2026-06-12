import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ReferenceLine
} from 'recharts';
import { Card, CardHeader, CardContent } from './ui/Card';
import { useExperimentStore } from '../store/useExperimentStore';
import { LineChart as ChartIcon } from 'lucide-react';
import PropTypes from 'prop-types';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: 12, borderRadius: 8, boxShadow: '0 6px 16px rgba(2,6,23,0.45)', color: 'var(--text-primary)', fontSize: 13 }}>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 8 }}>{label.toLocaleString()} Visitors</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, margin: '4px 0' }}>
            {entry.name}: {entry.value?.toFixed(2)}{entry.name.includes('Lift') || entry.name.includes('Rate') || entry.name.includes('CR') || entry.name.includes('Prob') || entry.name.includes('Conf') ? '%' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export const AnalyticsStage = () => {
  const chartData = useExperimentStore((state) => state.chartData);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      
      {/* Conversion Rate Trend */}
      <Card>
        <CardHeader title="Conversion Rate Trend" icon={ChartIcon} />
        <CardContent className="h-[190px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="visitors" stroke="var(--text-secondary)" tick={{fontSize: 12}} tickFormatter={(val) => `${val > 0 ? val/1000 + 'k' : 0}`} />
              <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} tickFormatter={(val) => `${val}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="crA" name="Variant A CR" stroke="var(--chart-variant-a)" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="crB" name="Variant B CR" stroke="var(--chart-variant-b)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Confidence Progression */}
      <Card>
        <CardHeader title="Statistical Confidence (Frequentist)" icon={ChartIcon} />
        <CardContent className="h-[190px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="visitors" stroke="var(--text-secondary)" tick={{fontSize: 12}} tickFormatter={(val) => `${val > 0 ? val/1000 + 'k' : 0}`} />
              <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="confidence" name="Confidence Level" stroke="var(--chart-confidence)" fill="var(--chart-confidence)" fillOpacity={0.14} isAnimationActive={false} />
              <ReferenceLine y={95} label={{ position: 'top', value: '95% Threshold', fill: 'var(--success)', fontSize: 12 }} stroke="var(--success)" strokeDasharray="3 3" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bayesian Probabilities */}
      <Card>
        <CardHeader title="Bayesian Win Probability" icon={ChartIcon} />
        <CardContent className="h-[190px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="visitors" stroke="var(--text-secondary)" tick={{fontSize: 12}} tickFormatter={(val) => `${val > 0 ? val/1000 + 'k' : 0}`} />
              <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="bayesianA" name="Prob A Beats B" stroke="var(--chart-variant-a)" fill="var(--chart-variant-a)" fillOpacity={0.12} stackId="1" isAnimationActive={false} />
              <Area type="monotone" dataKey="bayesianB" name="Prob B Beats A" stroke="var(--chart-variant-b)" fill="var(--chart-variant-b)" fillOpacity={0.12} stackId="1" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Lift Progression */}
      <Card>
        <CardHeader title="Relative Lift Progression" icon={ChartIcon} />
        <CardContent className="h-[190px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="visitors" stroke="var(--text-secondary)" tick={{fontSize: 12}} tickFormatter={(val) => `${val > 0 ? val/1000 + 'k' : 0}`} />
              <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} tickFormatter={(val) => `${val}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine y={0} stroke="var(--muted)" />
              <Line type="monotone" dataKey="lift" name="Lift (B vs A)" stroke="var(--success)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
};
