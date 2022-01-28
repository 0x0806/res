'use strict';
const assert = require('assert');
const cluster = require('cluster');
const EXIT_CODE = 42;
if (cluster.isWorker) {
  const http = require('http');
  const server = http.Server(() => { });
  server.once('listening', common.mustCall(() => {
    process.exit(EXIT_CODE);
  }));
  server.listen(0, '127.0.0.1');
} else if (cluster.isPrimary) {
  const expected_results = {
    cluster_emitDisconnect: [1, "the cluster did not emit 'disconnect'"],
    cluster_emitExit: [1, "the cluster did not emit 'exit'"],
    worker_emitDisconnect: [1, "the worker did not emit 'disconnect'"],
    worker_emitExit: [1, "the worker did not emit 'exit'"],
    worker_state: ['disconnected', 'the worker state is incorrect'],
    worker_exitedAfterDisconnect: [
      false, 'the .exitedAfterDisconnect flag is incorrect',
    ],
    worker_died: [true, 'the worker is still running'],
  };
  const results = {
    cluster_emitDisconnect: 0,
    cluster_emitExit: 0,
    worker_emitDisconnect: 0,
    worker_emitExit: 0
  };
  const worker = cluster.fork();
  cluster.on('disconnect', common.mustCall(() => {
    results.cluster_emitDisconnect += 1;
  }));
  cluster.on('exit', common.mustCall((worker) => {
    results.cluster_exitCode = worker.process.exitCode;
    results.cluster_signalCode = worker.process.signalCode;
    results.cluster_emitExit += 1;
  }));
  worker.on('disconnect', common.mustCall(() => {
    results.worker_emitDisconnect += 1;
    results.worker_exitedAfterDisconnect = worker.exitedAfterDisconnect;
    results.worker_state = worker.state;
    if (results.worker_emitExit > 0) {
      process.nextTick(() => finish_test());
    }
  }));
  worker.once('exit', common.mustCall((exitCode, signalCode) => {
    results.worker_exitCode = exitCode;
    results.worker_signalCode = signalCode;
    results.worker_emitExit += 1;
    results.worker_died = !common.isAlive(worker.process.pid);
    if (results.worker_emitDisconnect > 0) {
      process.nextTick(() => finish_test());
    }
  }));
  const finish_test = () => {
    try {
      checkResults(expected_results, results);
    } catch (exc) {
      if (exc.name !== 'AssertionError') {
        console.trace(exc);
      }
      process.exit(1);
      return;
    }
    process.exit(0);
  };
}
function checkResults(expected_results, results) {
  for (const k in expected_results) {
    const actual = results[k];
    const expected = expected_results[k];
    assert.strictEqual(
      actual, expected && expected.length ? expected[0] : expected,
  }
}
