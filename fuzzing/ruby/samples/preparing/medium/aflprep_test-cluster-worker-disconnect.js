'use strict';
const assert = require('assert');
const cluster = require('cluster');
if (cluster.isWorker) {
  const http = require('http');
  http.Server(() => {
  }).listen(0, '127.0.0.1');
  cluster.worker.on('disconnect', common.mustCall(() => {
    process.exit(42);
  }));
} else if (cluster.isPrimary) {
  const checks = {
    cluster: {
      emitDisconnect: false,
      emitExit: false,
      callback: false
    },
    worker: {
      emitDisconnect: false,
      emitDisconnectInsideWorker: false,
      emitExit: false,
      state: false,
      voluntaryMode: false,
      died: false
    }
  };
  const worker = cluster.fork();
  worker.once('listening', common.mustCall(() => {
    const w = worker.disconnect();
    assert.strictEqual(worker, w, `${worker.id} did not return a reference`);
  }));
  cluster.once('disconnect', common.mustCall(() => {
    checks.cluster.emitDisconnect = true;
  }));
  cluster.once('exit', common.mustCall(() => {
    checks.cluster.emitExit = true;
  }));
  worker.once('disconnect', common.mustCall(() => {
    checks.worker.emitDisconnect = true;
    checks.worker.voluntaryMode = worker.exitedAfterDisconnect;
    checks.worker.state = worker.state;
  }));
  worker.once('exit', common.mustCall((code) => {
    checks.worker.emitExit = true;
    checks.worker.died = !common.isAlive(worker.process.pid);
    checks.worker.emitDisconnectInsideWorker = code === 42;
  }));
  process.once('exit', () => {
    const w = checks.worker;
    const c = checks.cluster;
    assert.ok(w.emitDisconnect, 'Disconnect event did not emit');
    assert.ok(w.emitDisconnectInsideWorker,
              'Disconnect event did not emit inside worker');
    assert.ok(c.emitDisconnect, 'Disconnect event did not emit');
    assert.ok(w.emitExit, 'Exit event did not emit');
    assert.ok(c.emitExit, 'Exit event did not emit');
    assert.strictEqual(w.state, 'disconnected');
    assert.strictEqual(w.voluntaryMode, true);
    assert.ok(w.died, 'The worker did not die');
  });
}
