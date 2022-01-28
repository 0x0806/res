'use strict';
const assert = require('assert');
const net = require('net');
const SIZE = 2E6;
const N = 10;
const buf = Buffer.alloc(SIZE, 'a');
const server = net.createServer(function(socket) {
  socket.setNoDelay();
  socket.on('error', common.mustCall(() => socket.destroy()))
        .on('close', common.mustCall(() => server.close()));
  for (let i = 0; i < N; ++i) {
    socket.write(buf, () => {});
  }
  socket.end();
}).listen(0, function() {
  const conn = net.connect(this.address().port);
  conn.on('data', function(buf) {
    assert.strictEqual(conn, conn.pause());
    setTimeout(function() {
      conn.destroy();
    }, 20);
  });
});
