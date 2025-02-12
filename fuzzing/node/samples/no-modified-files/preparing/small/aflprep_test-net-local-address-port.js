'use strict';
const assert = require('assert');
const net = require('net');
const server = net.createServer(common.mustCall(function(socket) {
  assert.strictEqual(socket.localAddress, common.localhostIPv4);
  assert.strictEqual(socket.localPort, this.address().port);
  socket.on('end', function() {
    server.close();
  });
  socket.resume();
}));
server.listen(0, common.localhostIPv4, function() {
  const client = net.createConnection(this.address()
                    .port, common.localhostIPv4);
  client.on('connect', function() {
    client.end();
  });
});
