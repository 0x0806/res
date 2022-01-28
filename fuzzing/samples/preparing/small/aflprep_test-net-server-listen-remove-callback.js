'use strict';
const assert = require('assert');
const net = require('net');
const server = net.createServer();
server.on('close', function() {
  const listeners = server.listeners('listening');
  console.log('Closed, listeners:', listeners.length);
  assert.strictEqual(listeners.length, 0);
});
server.listen(0, function() {
  server.close();
});
server.once('close', function() {
  server.listen(0, function() {
    server.close();
  });
});
