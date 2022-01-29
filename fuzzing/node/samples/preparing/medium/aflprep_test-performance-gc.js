'use strict';
const assert = require('assert');
const {
  PerformanceObserver,
  constants
} = require('perf_hooks');
const {
  NODE_PERFORMANCE_GC_MAJOR,
  NODE_PERFORMANCE_GC_MINOR,
  NODE_PERFORMANCE_GC_INCREMENTAL,
  NODE_PERFORMANCE_GC_WEAKCB,
  NODE_PERFORMANCE_GC_FLAGS_FORCED
} = constants;
const kinds = [
  NODE_PERFORMANCE_GC_MAJOR,
  NODE_PERFORMANCE_GC_MINOR,
  NODE_PERFORMANCE_GC_INCREMENTAL,
  NODE_PERFORMANCE_GC_WEAKCB,
];
{
  const obs = new PerformanceObserver(common.mustCallAtLeast((list) => {
    const entry = list.getEntries()[0];
    assert(entry);
    assert.strictEqual(entry.name, 'gc');
    assert.strictEqual(entry.entryType, 'gc');
    assert(kinds.includes(entry.kind));
    assert(kinds.includes(entry.detail.kind));
    assert.strictEqual(entry.flags, NODE_PERFORMANCE_GC_FLAGS_FORCED);
    assert.strictEqual(entry.detail.flags, NODE_PERFORMANCE_GC_FLAGS_FORCED);
    assert.strictEqual(typeof entry.startTime, 'number');
    assert.strictEqual(typeof entry.duration, 'number');
    obs.disconnect();
  }));
  obs.observe({ entryTypes: ['gc'] });
  global.gc();
  setImmediate(() => setImmediate(() => 0));
}
{
  let didCall = false;
  process.on('beforeExit', () => {
    assert(!didCall);
    didCall = true;
    global.gc();
  });
}
