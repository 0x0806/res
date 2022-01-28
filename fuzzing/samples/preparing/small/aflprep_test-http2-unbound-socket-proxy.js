'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const net = require('net');
const server = http2.createServer();
server.on('stream', common.mustCall((stream) => {
  stream.respond();
  stream.end('ok');
}));
server.listen(0, common.mustCall(() => {
  const socket = client.socket;
  const req = client.request();
  req.resume();
  req.on('close', common.mustCall(() => {
    client.close();
    server.close();
    setImmediate(common.mustCall(() => {
      assert.throws(() => {
      }, {
        code: 'ERR_HTTP2_SOCKET_UNBOUND'
      });
      assert.throws(() => {
        socket.example = 1;
      }, {
        code: 'ERR_HTTP2_SOCKET_UNBOUND'
      });
      assert.throws(() => {
        socket instanceof net.Socket;
      }, {
        code: 'ERR_HTTP2_SOCKET_UNBOUND'
      });
    }));
  }));
}));
