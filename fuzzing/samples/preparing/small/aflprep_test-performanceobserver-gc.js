'use strict';
const {
  PerformanceObserver,
} = require('perf_hooks');
const obs = new PerformanceObserver(() => {});
const obs2 = new PerformanceObserver(() => {});
obs.observe({ type: 'gc' });
obs2.observe({ type: 'gc' });
