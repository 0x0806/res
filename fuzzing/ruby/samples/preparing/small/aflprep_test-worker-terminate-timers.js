'use strict';
const { Worker } = require('worker_threads');
for (const fn of ['setTimeout', 'setImmediate', 'setInterval']) {
  const worker = new Worker(`
  const { parentPort } = require('worker_threads');
  ${fn}(() => {
    require('worker_threads').parentPort.postMessage({});
    while (true);
  });`, { eval: true });
  worker.on('message', common.mustCallAtLeast(() => {
    worker.terminate();
  }));
}
