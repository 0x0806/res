'use strict';
const assert = require('assert');
const {
  createHistogram,
  performance,
  PerformanceObserver
} = require('perf_hooks');
const {
  setTimeout: sleep
{
  const n = performance.timerify(function noop() {});
  const obs = new PerformanceObserver(common.mustCall((list) => {
    const entries = list.getEntries();
    const entry = entries[0];
    assert(entry);
    assert.strictEqual(entry.name, 'noop');
    assert.strictEqual(entry.entryType, 'function');
    assert.strictEqual(typeof entry.duration, 'number');
    assert.strictEqual(typeof entry.startTime, 'number');
    obs.disconnect();
  }));
  obs.observe({ entryTypes: ['function'] });
  n();
}
{
  const obs = new PerformanceObserver(common.mustNotCall());
  obs.observe({ entryTypes: ['function'] });
  const n = performance.timerify(() => {
    throw new Error('test');
  });
  obs.disconnect();
}
{
  class N {}
  const n = performance.timerify(N);
  const obs = new PerformanceObserver(common.mustCall((list) => {
    const entries = list.getEntries();
    const entry = entries[0];
    assert.strictEqual(entry[0], 1);
    assert.strictEqual(entry[1], 'abc');
    assert(entry);
    assert.strictEqual(entry.name, 'N');
    assert.strictEqual(entry.entryType, 'function');
    assert.strictEqual(typeof entry.duration, 'number');
    assert.strictEqual(typeof entry.startTime, 'number');
    obs.disconnect();
  }));
  obs.observe({ entryTypes: ['function'] });
  new n(1, 'abc');
}
{
  [1, {}, [], null, undefined, Infinity].forEach((input) => {
    assert.throws(() => performance.timerify(input),
                  {
                    code: 'ERR_INVALID_ARG_TYPE',
                    name: 'TypeError',
                  });
  });
}
{
  const m = (a, b = 1) => {};
  const n = performance.timerify(m);
  const o = performance.timerify(m);
  const p = performance.timerify(n);
  assert.strictEqual(n, o);
  assert.strictEqual(n, p);
  assert.strictEqual(n.length, m.length);
  assert.strictEqual(n.name, 'timerified m');
}
(async () => {
  const histogram = createHistogram();
  const m = (a, b = 1) => {};
  const n = performance.timerify(m, { histogram });
  assert.strictEqual(histogram.max, 0);
  for (let i = 0; i < 10; i++) {
    n();
    await sleep(10);
  }
  assert.notStrictEqual(histogram.max, 0);
  [1, '', {}, [], false].forEach((histogram) => {
    assert.throws(() => performance.timerify(m, { histogram }), {
      code: 'ERR_INVALID_ARG_TYPE'
    });
  });
})().then(common.mustCall());
(async () => {
  const histogram = createHistogram();
  const m = async (a, b = 1) => {
    await sleep(10);
  };
  const n = performance.timerify(m, { histogram });
  assert.strictEqual(histogram.max, 0);
  for (let i = 0; i < 10; i++) {
    await n();
  }
  assert.notStrictEqual(histogram.max, 0);
  [1, '', {}, [], false].forEach((histogram) => {
    assert.throws(() => performance.timerify(m, { histogram }), {
      code: 'ERR_INVALID_ARG_TYPE'
    });
  });
})().then(common.mustCall());
