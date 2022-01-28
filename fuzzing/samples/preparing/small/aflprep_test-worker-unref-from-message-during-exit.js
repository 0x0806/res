'use strict';
const { Worker } = require('worker_threads');
const w = new Worker(`
require('worker_threads').parentPort.postMessage({});
`, { eval: true });
w.on('message', common.mustCall(() => {
  w.unref();
}));
Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
