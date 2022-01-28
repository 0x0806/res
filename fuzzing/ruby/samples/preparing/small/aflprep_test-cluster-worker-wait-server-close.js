'use strict';
const assert = require('assert');
const cluster = require('cluster');
const net = require('net');
let serverClosed = false;
if (cluster.isWorker) {
  const server = net.createServer(function(socket) {
    socket.write('.');
    socket.on('data', () => {});
  }).listen(0, common.localhostIPv4);
  server.once('close', function() {
    serverClosed = true;
  });
  const keepOpen = setInterval(() => {}, 9999);
  process.once('disconnect', function() {
    assert(serverClosed);
    clearInterval(keepOpen);
  });
} else if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.once('listening', function(address) {
    const socket = net.createConnection(address.port, common.localhostIPv4);
    socket.on('connect', function() {
      socket.on('data', function() {
        console.log('got data from client');
        worker.disconnect();
        socket.end();
      });
    });
  });
}
