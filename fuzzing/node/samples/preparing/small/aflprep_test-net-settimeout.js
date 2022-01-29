'use strict';
const net = require('net');
const assert = require('assert');
const T = 100;
const server = net.createServer(common.mustCall((c) => {
  c.write('hello');
}));
server.listen(0, function() {
  const socket = net.createConnection(this.address().port, 'localhost');
  const s = socket.setTimeout(T, common.mustNotCall());
  assert.ok(s instanceof net.Socket);
  socket.on('data', common.mustCall(() => {
    setTimeout(function() {
      socket.destroy();
      server.close();
    }, T * 2);
  }));
  socket.setTimeout(0);
});
