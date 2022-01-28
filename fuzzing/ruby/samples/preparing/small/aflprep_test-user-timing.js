'use strict';
const runner = new WPTRunner('user-timing');
runner.setFlags(['--expose-internals']);
runner.setInitScript(`
  const {
    PerformanceMark,
    PerformanceMeasure,
    PerformanceObserver,
    performance,
  } = require('perf_hooks');
  global.PerformanceMark = performance;
  global.PerformanceMeasure = performance;
  global.PerformanceObserver = PerformanceObserver;
  global.performance = performance;
  const { DOMException } = internalBinding('messaging');
  global.DOMException = DOMException;
`);
runner.runJsTests();
