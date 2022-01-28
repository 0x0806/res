'use strict';
const net = require('net');
const assert = require('assert');
const server = net.createServer();
server.listen(0, common.mustCall(function() {
  const port = server.address().port;
  const conn = net.createConnection(port);
  conn.on('connect', common.mustCall(function() {
    assert.strictEqual(conn, conn.destroy().destroy());
    conn.on('error', common.mustNotCall());
    conn.write(Buffer.from('kaboom'), common.expectsError({
      code: 'ERR_STREAM_DESTROYED',
      message: 'Cannot call write after a stream was destroyed',
      name: 'Error'
    }));
    server.close();
  }));
}));
