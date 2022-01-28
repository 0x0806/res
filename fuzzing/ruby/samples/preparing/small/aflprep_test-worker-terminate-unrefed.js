'use strict';
const { once } = require('events');
const { Worker } = require('worker_threads');
async function test() {
  const worker = new Worker('setTimeout(() => {}, 1000000);', { eval: true });
  await once(worker, 'online');
  worker.unref();
  await worker.terminate();
}
test().then(common.mustCall());
