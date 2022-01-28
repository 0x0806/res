'use strict';
const assert = require('assert');
const cluster = require('cluster');
if (cluster.isPrimary) {
  function forkWorker(action) {
    const worker = cluster.fork({ action });
    worker.on('disconnect', common.mustCall(() => {
      assert.strictEqual(worker.exitedAfterDisconnect, true);
    }));
    worker.on('exit', common.mustCall(() => {
      assert.strictEqual(worker.exitedAfterDisconnect, true);
    }));
  }
  forkWorker('disconnect');
  forkWorker('kill');
} else {
  cluster.worker[process.env.action]();
}
