'use strict';
const assert = require('assert');
const http = require('http');
const net = require('net');
const server = http.createServer(function(req, res) {
  throw new Error('This shouldn\'t happen.');
});
server.on('upgrade', function(req, socket, upgradeHead) {
  throw new Error('upgrade error');
});
process.on('uncaughtException', common.mustCall(function(e) {
  assert.strictEqual(e.message, 'upgrade error');
  process.exit(0);
}));
server.listen(0, function() {
  const c = net.createConnection(this.address().port);
  c.on('connect', function() {
            'Upgrade: WebSocket\r\n' +
            'Connection: Upgrade\r\n' +
            '\r\n\r\nhello world');
  });
  c.on('end', function() {
    c.end();
  });
  c.on('close', function() {
    server.close();
  });
});
