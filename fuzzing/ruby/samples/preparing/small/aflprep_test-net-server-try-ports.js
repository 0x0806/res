'use strict';
const assert = require('assert');
const net = require('net');
const server1 = net.Server();
const server2 = net.Server();
server2.on('error', common.mustCall(function(e) {
  assert.strictEqual(e.code, 'EADDRINUSE');
  server2.listen(0, common.mustCall(function() {
    server1.close();
    server2.close();
  }));
}));
server1.listen(0, common.mustCall(function() {
  server2.listen(this.address().port);
}));
