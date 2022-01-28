'use strict';
const assert = require('assert');
const cluster = require('cluster');
const msg = 'foo';
if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('message', common.mustCall((message) => {
    assert.strictEqual(message, true);
    const w = worker.disconnect();
    assert.strictEqual(worker, w);
  }));
  worker.on('online', () => {
    worker.send(msg);
  });
} else {
  cluster.worker.on('message', (message) => {
    process.send(message === msg);
  });
}
