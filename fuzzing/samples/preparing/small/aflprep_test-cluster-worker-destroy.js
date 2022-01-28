'use strict';
const assert = require('assert');
const cluster = require('cluster');
let worker1, worker2;
if (cluster.isPrimary) {
  worker1 = cluster.fork();
  worker2 = cluster.fork();
  [worker1, worker2].forEach(function(worker) {
    worker.on('disconnect', common.mustCall());
    worker.on('exit', common.mustCall());
  });
} else if (cluster.worker.id === 1) {
  cluster.worker.process.on('disconnect', function() {
    cluster.worker.destroy();
  });
  const w = cluster.worker.disconnect();
  assert.strictEqual(w, cluster.worker);
} else {
  cluster.worker.destroy();
}
