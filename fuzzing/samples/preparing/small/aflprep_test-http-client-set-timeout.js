'use strict';
const { strictEqual } = require('assert');
const { createServer, get } = require('http');
const server = createServer(() => {
});
server.listen(0, mustCall(() => {
  const req = get({
    port: server.address().port,
    timeout: 2000,
  });
  req.setTimeout(1000);
  req.on('socket', mustCall((socket) => {
    strictEqual(socket.timeout, 2000);
    socket.on('connect', mustCall(() => {
      strictEqual(socket.timeout, 1000);
      socket.setTimeout(10);
      strictEqual(socket.timeout, 10);
    }));
  }));
  req.on('error', expectsError({
    name: 'Error',
    code: 'ECONNRESET',
    message: 'socket hang up'
  }));
  req.on('close', mustCall(() => {
    strictEqual(req.destroyed, true);
    server.close();
  }));
  req.on('timeout', mustCall(() => {
    strictEqual(req.socket.listenerCount('timeout'), 1);
    req.destroy();
  }));
}));
