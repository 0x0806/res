'use strict';
const assert = require('assert');
const cluster = require('cluster');
const net = require('net');
const payload = 'a'.repeat(800004);
if (cluster.isPrimary) {
  const server = net.createServer();
  server.on('connection', common.mustCall((socket) => { socket.unref(); }));
  const worker = cluster.fork();
  worker.on('message', common.mustCall(({ payload: received }, handle) => {
    assert.strictEqual(payload, received);
    assert(handle instanceof net.Socket);
    server.close();
    handle.destroy();
  }));
  server.listen(0, common.mustCall(() => {
    const port = server.address().port;
    const socket = new net.Socket();
    socket.connect(port, (err) => {
      assert.ifError(err);
      worker.send({ payload }, socket);
    });
  }));
} else {
  process.on('message', common.mustCall(({ payload: received }, handle) => {
    assert.strictEqual(payload, received);
    assert(handle instanceof net.Socket);
    if (common.isOSX)
      setTimeout(() => { process.send({ payload }, handle); }, 1000);
    else
      process.send({ payload }, handle);
    process.channel.unref();
  }));
}
