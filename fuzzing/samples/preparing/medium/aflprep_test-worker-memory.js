'use strict';
if (common.isIBMi)
  common.skip('On IBMi, the rss memory always returns zero');
const assert = require('assert');
const util = require('util');
const { Worker } = require('worker_threads');
let numWorkers = +process.env.JOBS || require('os').cpus().length;
if (numWorkers > 20) {
  numWorkers = 20;
}
function run(n, done) {
  console.log(`run() called with n=${n} (numWorkers=${numWorkers})`);
  if (n <= 0)
    return done();
  const worker = new Worker(
    'require(\'worker_threads\').parentPort.postMessage(2 + 2)',
    { eval: true });
  worker.on('message', common.mustCall((value) => {
    assert.strictEqual(value, 4);
  }));
  worker.on('exit', common.mustCall(() => {
    run(n - 1, done);
  }));
}
const startStats = process.memoryUsage();
let finished = 0;
for (let i = 0; i < numWorkers; ++i) {
    console.log(`done() called (finished=${finished})`);
    if (++finished === numWorkers) {
      const finishStats = process.memoryUsage();
                'Unexpected memory overhead: ' +
                util.inspect([startStats, finishStats]));
    }
  });
}
