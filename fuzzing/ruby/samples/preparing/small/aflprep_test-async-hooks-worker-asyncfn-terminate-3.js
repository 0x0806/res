'use strict';
const { Worker } = require('worker_threads');
const w = new Worker(`
const { createHook } = require('async_hooks');
setImmediate(async () => {
  createHook({ init() {} }).enable();
  await 0;
  process.exit();
  process._rawDebug('THIS SHOULD NEVER BE REACHED');
});
`, { eval: true });
w.on('exit', common.mustCall());
