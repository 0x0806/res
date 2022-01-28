'use strict';
const assert = require('assert');
const cluster = require('cluster');
const os = require('os');
if (cluster.isPrimary) {
  const workers = [];
  const numCPUs = os.cpus().length;
  let waitOnline = numCPUs;
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    workers[i] = worker;
    worker.once('online', common.mustCall(() => {
      if (--waitOnline === 0)
        for (const worker of workers)
          if (worker.isConnected())
            worker.send(i % 2 ? 'disconnect' : 'destroy');
    }));
    worker.on('error', (err) => {
      assert.strictEqual(err.syscall, 'write');
      assert.strictEqual(err.code, 'EPIPE');
    });
    worker.once('disconnect', common.mustCall(() => {
      for (const worker of workers)
        if (worker.isConnected())
          worker.send('disconnect');
    }));
    worker.once('exit', common.mustCall((code, signal) => {
      assert.strictEqual(code, 0);
      assert.strictEqual(signal, null);
    }));
  }
} else {
  process.on('message', (msg) => {
    if (cluster.worker.isConnected())
      cluster.worker[msg]();
  });
}
