/**
 * src/workers/simulationWorker.js
 */

let isRunning = false;
let config = null;
let currentVisitors = 0;
let targetVisitors = 0;
let metrics = {
  impressionsA: 0,
  conversionsA: 0,
  impressionsB: 0,
  conversionsB: 0,
};

const tickRateMs = 50; // 20 ticks per second

const runChunk = () => {
  if (!isRunning) return;

  if (currentVisitors >= targetVisitors) {
    isRunning = false;
    postMessage({ type: 'COMPLETED', metrics, currentVisitors });
    return;
  }

  // Determine chunk size based on speed
  // 1x = 100 visitors/sec -> 5 per tick
  // 10x = 1000 visitors/sec -> 50 per tick
  // 100x = 10,000 visitors/sec -> 500 per tick
  // 1000x = 100,000 visitors/sec -> 5000 per tick
  const baseChunkSize = config.speed * 5; 
  const chunkSize = Math.min(baseChunkSize, targetVisitors - currentVisitors);
  
  for (let i = 0; i < chunkSize; i++) {
    const isVariantA = (Math.random() * 100) < config.trafficAllocation;
    
    if (isVariantA) {
      metrics.impressionsA++;
      if ((Math.random() * 100) < config.conversionProbabilityA) {
        metrics.conversionsA++;
      }
    } else {
      metrics.impressionsB++;
      if ((Math.random() * 100) < config.conversionProbabilityB) {
        metrics.conversionsB++;
      }
    }
  }

  currentVisitors += chunkSize;

  // Send update to main thread
  postMessage({ type: 'UPDATE', metrics, currentVisitors });

  // Schedule next chunk
  if (isRunning) {
    setTimeout(runChunk, tickRateMs);
  }
};

self.onmessage = (e) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'START':
      config = payload.config;
      targetVisitors = payload.targetVisitors;
      isRunning = true;
      runChunk();
      break;
    case 'PAUSE':
      isRunning = false;
      postMessage({ type: 'PAUSED', metrics, currentVisitors });
      break;
    case 'RESUME':
      if (!isRunning) {
        isRunning = true;
        runChunk();
      }
      break;
    case 'RESET':
      isRunning = false;
      currentVisitors = 0;
      metrics = {
        impressionsA: 0,
        conversionsA: 0,
        impressionsB: 0,
        conversionsB: 0,
      };
      postMessage({ type: 'UPDATE', metrics, currentVisitors });
      break;
    case 'UPDATE_CONFIG':
      config = { ...config, ...payload };
      break;
  }
};
