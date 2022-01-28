'use strict';
const assert = require('assert');
const { isMainThread, parentPort, Worker } = require('worker_threads');
{
  if (isMainThread) {
    const worker = new Worker(__filename);
    worker.on('exit', common.mustCall((code) => {
      assert.strictEqual(code, 0);
    }), 1);
    worker.on('online', common.mustCall());
  } else {
    const messageCallback = () => {};
    parentPort.on('message', messageCallback);
    parentPort.off('message', messageCallback);
  }
}
