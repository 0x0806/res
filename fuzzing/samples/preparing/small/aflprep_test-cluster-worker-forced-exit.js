'use strict';
const assert = require('assert');
const cluster = require('cluster');
const SENTINEL = 42;
if (cluster.isWorker) {
  process.on('disconnect', (msg) => {
    setTimeout(() => process.exit(SENTINEL), 10);
  });
  return;
}
checkUnforced();
checkForced();
function checkUnforced() {
  const worker = cluster.fork();
  worker
    .on('online', common.mustCall(() => worker.disconnect()))
    .on('exit', common.mustCall((status) => {
      assert.strictEqual(status, SENTINEL);
    }));
}
function checkForced() {
  const worker = cluster.fork();
  worker
    .on('online', common.mustCall(() => worker.process.disconnect()))
    .on('exit', common.mustCall((status) => assert.strictEqual(status, 0)));
}
