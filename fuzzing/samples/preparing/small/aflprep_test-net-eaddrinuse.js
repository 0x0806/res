'use strict';
const assert = require('assert');
const net = require('net');
const server1 = net.createServer(function(socket) {
});
const server2 = net.createServer(function(socket) {
});
server1.listen(0, common.mustCall(function() {
  server2.on('error', function(error) {
    assert.strictEqual(error.message.includes('EADDRINUSE'), true);
    server1.close();
  });
  server2.listen(this.address().port);
}));
