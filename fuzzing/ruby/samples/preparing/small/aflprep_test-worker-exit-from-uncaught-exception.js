'use strict';
const assert = require('assert');
const { Worker } = require('worker_threads');
if (!process.env.HAS_STARTED_WORKER) {
  process.env.HAS_STARTED_WORKER = 1;
  const w = new Worker(__filename);
  w.on('exit', common.mustCall((code) => {
    assert.strictEqual(code, 42);
  }));
  return;
}
process.on('uncaughtException', () => {
  process.exit(42);
});
throw new Error();
