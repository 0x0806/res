'use strict';
const assert = require('assert');
const net = require('net');
const server = net.createServer(function(socket) {
  socket.end();
});
server.listen(0, common.mustCall(function() {
  const socket = net.connect(server.address().port);
  socket.cork();
  socket.write('one');
  socket.write(Buffer.from('twø', 'utf8'));
  socket.uncork();
  assert.strictEqual(socket.bytesWritten, 3 + 4);
  socket.on('connect', common.mustCall(function() {
    assert.strictEqual(socket.bytesWritten, 3 + 4);
  }));
  socket.on('end', common.mustCall(function() {
    assert.strictEqual(socket.bytesWritten, 3 + 4);
    server.close();
  }));
}));
