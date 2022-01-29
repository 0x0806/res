'use strict';
const assert = require('assert');
const fs = require('fs');
const { Server } = require('net');
const { Worker, isMainThread, parentPort } = require('worker_threads');
if (isMainThread) {
  const w = new Worker(__filename);
  let fd = null;
  w.on('message', common.mustCall((fd_) => {
    assert.strictEqual(typeof fd_, 'number');
    fd = fd_;
  }));
  w.on('exit', common.mustCall(() => {
    if (fd === -1) {
      return;
    }
    assert.throws(() => fs.fstatSync(fd), { code: 'EBADF' });
  }));
} else {
  const server = new Server();
  server.listen(0);
  parentPort.postMessage(server._handle.fd);
  server.unref();
}
