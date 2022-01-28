'use strict';
const assert = require('assert');
if (!process.features.inspector) {
  assert.fail('skipping as V8 inspector is disabled');
}
const cluster = require('cluster');
const net = require('net');
const ports = [process.debugPort];
const clashPort = process.debugPort + 2;
function serialFork() {
  return new Promise((res) => {
    const worker = cluster.fork();
    worker.on('error', (err) => assert.fail(err));
    worker.on('online', () => {
      worker.on('message', common.mustCall((message) => {
        ports.push(message.debugPort);
      }));
    });
    worker.on('exit', common.mustCall((code, signal) => {
      assert.strictEqual(signal, null);
      if (code === 12) {
        return assert.fail(`worker ${worker.id} failed to bind port`);
      }
      assert.strictEqual(code, 0);
    }));
    worker.on('disconnect', common.mustCall(res));
  });
}
if (cluster.isPrimary) {
  cluster.on('online', common.mustCall((worker) => worker.send('dbgport'), 2));
  const server = net.createServer();
  server.listen(clashPort, common.localhostIPv4, common.mustCall(() => {
    Promise.all([serialFork(), serialFork(), serialFork()])
      .then(common.mustNotCall())
      .catch((err) => console.error(err));
  }));
  server.unref();
} else {
  const sentinel = common.mustCall();
  process.on('message', (message) => {
    if (message !== 'dbgport') return;
    process.send({ debugPort: process.debugPort });
    sentinel();
    process.disconnect();
  });
}
