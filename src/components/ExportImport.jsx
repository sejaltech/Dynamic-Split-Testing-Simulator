import { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { useExperimentStore } from '../store/useExperimentStore';

export const ExportImport = () => {
  const fileInputRef = useRef(null);
  
  const handleExport = () => {
    const state = useExperimentStore.getState();
    const data = {
      config: state.config,
      metrics: state.metrics,
      chartData: state.chartData,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ab-test-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.config && data.metrics && data.chartData) {
          const store = useExperimentStore.getState();
          store.updateConfig(data.config);
          store.updateMetrics(data.metrics);
          store.setChartData(data.chartData);
          alert('Experiment imported successfully!');
        } else {
          alert('Invalid file format. Missing required fields.');
        }
      } catch {
        alert('Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = null; // reset
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={handleExport}
        className="btn btn-primary text-sm"
      >
        <Download className="w-4 h-4" /> Export
      </button>
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="btn btn-secondary text-sm"
      >
        <Upload className="w-4 h-4" /> Import
      </button>
      <input 
        type="file" 
        accept=".json" 
        ref={fileInputRef} 
        onChange={handleImport} 
        className="hidden" 
      />
    </div>
  );
};
