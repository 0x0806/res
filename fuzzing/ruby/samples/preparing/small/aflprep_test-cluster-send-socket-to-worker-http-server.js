'use strict';
const assert = require('assert');
const cluster = require('cluster');
const http = require('http');
const net = require('net');
if (cluster.isPrimary) {
  const worker = cluster.fork();
  const server = net.createServer(common.mustCall((socket) => {
    worker.send('socket', socket);
  }));
  worker.on('exit', common.mustCall((code) => {
    assert.strictEqual(code, 0);
    server.close();
  }));
  server.listen(0, common.mustCall(() => {
    net.createConnection(server.address().port);
  }));
} else {
  const server = http.createServer();
  server.on('connection', common.mustCall((socket) => {
    assert.strictEqual(socket.server, server);
    socket.destroy();
    cluster.worker.disconnect();
  }));
  process.on('message', common.mustCall((message, socket) => {
    server.emit('connection', socket);
  }));
}
