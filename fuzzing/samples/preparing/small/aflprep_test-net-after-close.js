'use strict';
const assert = require('assert');
const net = require('net');
const server = net.createServer(common.mustCall((s) => {
  console.error('SERVER: got connection');
  s.end();
}));
server.listen(0, common.mustCall(() => {
  const c = net.createConnection(server.address().port);
  c.on('close', common.mustCall(() => {
    console.error('connection closed');
    assert.strictEqual(c._handle, null);
    c.setNoDelay();
    c.setKeepAlive();
    c.bufferSize;
    c.pause();
    c.resume();
    c.address();
    c.remoteAddress;
    c.remotePort;
    server.close();
  }));
}));
