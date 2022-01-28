'use strict';
const { Worker } = require('worker_threads');
const w = new Worker(`
const { createHook } = require('async_hooks');
setImmediate(async () => {
  await 0;
  createHook({ init() {} }).enable();
  process.exit();
});
`, { eval: true });
w.postMessage({});
w.on('exit', common.mustCall());
