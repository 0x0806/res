'use strict';
const cluster = require('cluster');
const assert = require('assert');
if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('online', common.mustCall(() => {
    worker.process.kill();
  }));
  worker.on('exit', common.mustCall((code, signal) => {
    assert.strictEqual(code, null);
    assert.strictEqual(signal, 'SIGTERM');
  }));
} else {
  while (true) {}
}
