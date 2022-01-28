'use strict';
const assert = require('assert');
const { Worker, workerData, parentPort } = require('worker_threads');
if (!workerData) {
  tmpdir.refresh();
  process.env.NODE_V8_COVERAGE = tmpdir.path;
  const callCount = new Int32Array(new SharedArrayBuffer(4));
  const w = new Worker(__filename, { workerData: { callCount } });
  w.on('message', common.mustCall(() => w.terminate()));
  w.on('exit', common.mustCall(() => {
    assert.strictEqual(callCount[0], 0);
  }));
  return;
}
const { callCount } = workerData;
function increaseCallCount() { callCount[0]++; }
for (const property of ['_cache', 'lineLengths', 'url']) {
  Object.defineProperty(Object.prototype, property, {
    get: increaseCallCount,
    set: increaseCallCount
  });
}
Object.getPrototypeOf([][Symbol.iterator]()).next = increaseCallCount;
Object.getPrototypeOf((new Map()).entries()).next = increaseCallCount;
Array.prototype[Symbol.iterator] = increaseCallCount;
Map.prototype[Symbol.iterator] = increaseCallCount;
Map.prototype.entries = increaseCallCount;
Object.keys = increaseCallCount;
Object.create = increaseCallCount;
Object.hasOwnProperty = increaseCallCount;
parentPort.postMessage('done');
