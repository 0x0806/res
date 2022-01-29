'use strict';
const {
  PerformanceObserver,
} = require('perf_hooks');
const gcObserver = new PerformanceObserver(() => {});
gcObserver.observe({ entryTypes: ['gc'] });
gcObserver.disconnect();
const gcObserver2 = new PerformanceObserver(() => {});
gcObserver2.observe({ entryTypes: ['gc'] });
gcObserver2.disconnect();
