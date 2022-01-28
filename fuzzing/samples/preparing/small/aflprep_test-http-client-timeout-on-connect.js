'use strict';
const assert = require('assert');
const http = require('http');
const server = http.createServer((req, res) => {
});
server.listen(0, common.localhostIPv4, common.mustCall(() => {
  const port = server.address().port;
  req.setTimeout(1);
  req.on('socket', common.mustCall((socket) => {
    assert.strictEqual(socket[kTimeout], null);
    socket.on('connect', common.mustCall(() => {
      assert.strictEqual(socket[kTimeout]._idleTimeout, 1);
    }));
  }));
  req.on('timeout', common.mustCall(() => req.abort()));
  req.on('error', common.mustCall((err) => {
    assert.strictEqual(err.message, 'socket hang up');
    server.close();
  }));
}));
