'use strict';
const http = require('http');
const net = require('net');
const assert = require('assert');
               'Foo: Bar\r' +
               'Content-Length: 1\r\n\r\n';
const server = net.createServer((socket) => {
  socket.write(reqstr);
});
server.listen(0, () => {
  const req = http.get({ port: server.address().port }, common.mustNotCall());
  req.on('error', common.mustCall((err) => {
    assert.strictEqual(err.code, 'HPE_LF_EXPECTED');
    server.close();
  }));
});
