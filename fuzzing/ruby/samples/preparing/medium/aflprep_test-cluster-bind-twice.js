'use strict';
const assert = require('assert');
const cluster = require('cluster');
const fork = require('child_process').fork;
const http = require('http');
const id = process.argv[2];
if (!id) {
  const a = fork(__filename, ['one']);
  const b = fork(__filename, ['two']);
  a.on('exit', common.mustCall((c) => {
    if (c) {
      b.send('QUIT');
      throw new Error(`A exited with ${c}`);
    }
  }));
  b.on('exit', common.mustCall((c) => {
    if (c) {
      a.send('QUIT');
      throw new Error(`B exited with ${c}`);
    }
  }));
  a.on('message', common.mustCall((m) => {
    assert.strictEqual(m.msg, 'READY');
    b.send({ msg: 'START', port: m.port });
  }));
  b.on('message', common.mustCall((m) => {
    assert.strictEqual(m, 'EADDRINUSE');
    a.send('QUIT');
    b.send('QUIT');
  }));
} else if (id === 'one') {
  if (cluster.isPrimary) return startWorker();
  const server = http.createServer(common.mustNotCall());
  server.listen(0, common.mustCall(() => {
    process.send({ msg: 'READY', port: server.address().port });
  }));
  process.on('message', common.mustCall((m) => {
    if (m === 'QUIT') process.exit();
  }));
} else if (id === 'two') {
  if (cluster.isPrimary) return startWorker();
  const server = http.createServer(common.mustNotCall());
  process.on('message', common.mustCall((m) => {
    if (m === 'QUIT') process.exit();
    assert.strictEqual(m.msg, 'START');
    server.listen(m.port, common.mustNotCall());
    server.on('error', common.mustCall((e) => {
      assert.strictEqual(e.code, 'EADDRINUSE');
      process.send(e.code);
    }));
  }, 2));
} else {
}
function startWorker() {
  const worker = cluster.fork();
  worker.on('exit', process.exit);
  worker.on('message', process.send.bind(process));
  process.on('message', worker.send.bind(worker));
}
