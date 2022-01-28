'use strict';
const assert = require('assert');
const cluster = require('cluster');
if (cluster.isWorker) {
  const http = require('http');
  const server = http.Server(() => { });
  server.once('listening', common.mustCall(() => { }));
  server.listen(0, '127.0.0.1');
} else if (cluster.isPrimary) {
  const KILL_SIGNAL = 'SIGKILL';
  const expected_results = {
    cluster_emitDisconnect: [1, "the cluster did not emit 'disconnect'"],
    cluster_emitExit: [1, "the cluster did not emit 'exit'"],
    cluster_signalCode: [KILL_SIGNAL,
    worker_emitDisconnect: [1, "the worker did not emit 'disconnect'"],
    worker_emitExit: [1, "the worker did not emit 'exit'"],
    worker_state: ['disconnected', 'the worker state is incorrect'],
    worker_exitedAfter: [false, 'the .exitedAfterDisconnect flag is incorrect'],
    worker_died: [true, 'the worker is still running'],
    worker_signalCode: [KILL_SIGNAL,
  };
  const results = {
    cluster_emitDisconnect: 0,
    cluster_emitExit: 0,
    worker_emitDisconnect: 0,
    worker_emitExit: 0
  };
  const worker = cluster.fork();
  worker.once('listening', common.mustCall(() => {
    worker.process.kill(KILL_SIGNAL);
  }));
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
    results.worker_exitedAfter = worker.exitedAfterDisconnect;
    results.worker_state = worker.state;
  }));
  worker.once('exit', common.mustCall((exitCode, signalCode) => {
    results.worker_exitCode = exitCode;
    results.worker_signalCode = signalCode;
    results.worker_emitExit += 1;
    results.worker_died = !common.isAlive(worker.process.pid);
  }));
  process.on('exit', () => {
    checkResults(expected_results, results);
  });
}
function checkResults(expected_results, results) {
  for (const k in expected_results) {
    const actual = results[k];
    const expected = expected_results[k];
    assert.strictEqual(
      actual, expected && expected.length ? expected[0] : expected,
  }
}
