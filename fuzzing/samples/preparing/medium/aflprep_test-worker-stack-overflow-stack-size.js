'use strict';
const assert = require('assert');
const { once } = require('events');
const v8 = require('v8');
const { Worker } = require('worker_threads');
async function runWorker(options = {}) {
  const empiricalStackDepth = new Uint32Array(new SharedArrayBuffer(4));
  const worker = new Worker(`
  const { workerData: { empiricalStackDepth } } = require('worker_threads');
  function f() {
    empiricalStackDepth[0]++;
    f();
  }
  f();`, {
    eval: true,
    workerData: { empiricalStackDepth },
    ...options
  });
  const [ error ] = await once(worker, 'error');
  if (!options.skipErrorCheck) {
    common.expectsError({
      constructor: RangeError,
      message: 'Maximum call stack size exceeded'
    })(error);
  }
  return empiricalStackDepth[0];
}
(async function() {
  {
    v8.setFlagsFromString('--stack-size=500');
    const w1stack = await runWorker();
    v8.setFlagsFromString('--stack-size=1000');
    const w2stack = await runWorker();
           `w1stack = ${w1stack}, w2stack = ${w2stack} are too far apart`);
  }
  {
    const w1stack = await runWorker({ resourceLimits: { stackSizeMb: 0.5 } });
    const w2stack = await runWorker({ resourceLimits: { stackSizeMb: 1.0 } });
    assert(w2stack > w1stack * 1.4,
           `w1stack = ${w1stack}, w2stack = ${w2stack} are too close`);
  }
  for (const stackSizeMb of [ 0.001, 0.01, 0.1, 0.2, 0.3, 0.5 ]) {
    await runWorker({ resourceLimits: { stackSizeMb }, skipErrorCheck: true });
  }
})().then(common.mustCall());
