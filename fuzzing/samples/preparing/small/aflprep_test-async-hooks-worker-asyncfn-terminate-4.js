'use strict';
const assert = require('assert');
const { Worker } = require('worker_threads');
const workerData = new Int32Array(new SharedArrayBuffer(4));
const w = new Worker(`
const { createHook } = require('async_hooks');
setImmediate(async () => {
  createHook({ init() {} }).enable();
  await 0;
  process.exit();
  workerData[0]++;
});
`, { eval: true, workerData });
w.on('exit', common.mustCall(() => assert.strictEqual(workerData[0], 0)));
