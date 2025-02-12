'use strict';
const assert = require('assert');
const { Worker } = require('worker_threads');
if (!process.env.HAS_STARTED_WORKER) {
  process.env.HAS_STARTED_WORKER = 1;
  const w = new Worker(__filename);
  w.on('exit', common.mustCall((code) => {
    assert.strictEqual(code, 0);
  }));
  return;
}
process.once('uncaughtException', () => {
  process.nextTick(() => {
    assert.strictEqual(res, true);
  });
});
const res = process._fatalException(new Error());
