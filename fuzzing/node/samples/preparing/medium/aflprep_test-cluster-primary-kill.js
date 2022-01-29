'use strict';
const assert = require('assert');
const cluster = require('cluster');
if (cluster.isWorker) {
  const http = require('http');
  http.Server().listen(0, '127.0.0.1');
} else if (process.argv[2] === 'cluster') {
  const worker = cluster.fork();
  process.send({
    pid: worker.process.pid
  });
  worker.once('listening', common.mustCall(() => {
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }));
} else {
  const fork = require('child_process').fork;
  const primary = fork(process.argv[1], ['cluster']);
  let pid = null;
  primary.once('message', (data) => {
    pid = data.pid;
  });
  let alive = true;
  primary.on('exit', common.mustCall((code) => {
    assert.strictEqual(code, 0);
    const pollWorker = () => {
      alive = common.isAlive(pid);
      if (alive) {
        setTimeout(pollWorker, 50);
      }
    };
    pollWorker();
  }));
  process.once('exit', () => {
    assert.strictEqual(typeof pid, 'number',
                       `got ${pid} instead of a worker pid`);
    assert.strictEqual(alive, false,
                       `worker was alive after primary died (alive = ${alive})`
    );
  });
}
