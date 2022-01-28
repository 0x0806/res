'use strict';
const assert = require('assert');
const { Worker } = require('worker_threads');
if (!process.env.HAS_STARTED_WORKER) {
  process.env.HAS_STARTED_WORKER = 1;
  const w = new Worker(__filename);
  w.on('message', common.mustNotCall());
  w.on('error', common.mustCall((err) => {
    console.log(err.message);
  }));
  w.on('exit', common.mustCall((code) => {
    assert.strictEqual(code, 1);
  }));
} else {
  let called = false;
  process.on('exit', (code) => {
    if (!called) {
      called = true;
    } else {
      assert.fail('Exit callback called twice in worker');
    }
  });
  setTimeout(() => assert.fail('Timeout executed after uncaughtException'),
             2000);
  throw new Error('foo');
}
