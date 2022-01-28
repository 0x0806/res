'use strict';
const perf_hooks = require('perf_hooks');
const {
  strictEqual
} = require('assert');
const perf = performance;
strictEqual(globalThis.performance, perf_hooks.performance);
performance = undefined;
strictEqual(globalThis.performance, undefined);
strictEqual(typeof perf_hooks.performance.now, 'function');
performance = perf;
