'use strict';
const assert = require('assert');
const cluster = require('cluster');
const totalWorkers = 2;
if (cluster.isWorker) {
  const http = require('http');
  http.Server(() => {}).listen(0, '127.0.0.1');
} else if (process.argv[2] === 'cluster') {
  let forkNum = 0;
  cluster.on('fork', common.mustCall(function forkEvent(worker) {
    process.send({
      cmd: 'worker',
      workerPID: worker.process.pid
    });
    if (++forkNum === totalWorkers) {
      cluster.removeListener('fork', forkEvent);
    }
  }, totalWorkers));
  let listeningNum = 0;
  cluster.on('listening', common.mustCall(function listeningEvent() {
    if (++listeningNum === totalWorkers) {
      cluster.removeListener('listening', listeningEvent);
      process.nextTick(() => {
        throw new Error('accidental error');
      });
    }
  }, totalWorkers));
  cluster.fork();
  cluster.fork();
} else {
  const fork = require('child_process').fork;
  const workers = [];
  const primary = fork(process.argv[1], ['cluster'], { silent: true });
  primary.on('message', common.mustCall((data) => {
    if (data.cmd === 'worker') {
      workers.push(data.workerPID);
    }
  }, totalWorkers));
  primary.on('exit', common.mustCall((code) => {
    assert.strictEqual(code, 1);
    const pollWorkers = () => {
      if (workers.some((pid) => common.isAlive(pid))) {
        setTimeout(pollWorkers, 50);
      }
    };
    pollWorkers();
  }));
}
