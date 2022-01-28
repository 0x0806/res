'use strict';
const runner = new WPTRunner('performance-timeline');
runner.setFlags(['--expose-internals']);
runner.setInitScript(`
  const {
    PerformanceMark,
    PerformanceMeasure,
    PerformanceObserver,
    PerformanceObserverEntryList,
    performance,
  } = require('perf_hooks');
  global.PerformanceMark = performance;
  global.PerformanceMeasure = performance;
  global.PerformanceObserver = PerformanceObserver;
  global.PerformanceObserverEntryList = PerformanceObserverEntryList;
  global.performance = performance;
  const { DOMException } = internalBinding('messaging');
  global.DOMException = DOMException;
`);
runner.runJsTests();
