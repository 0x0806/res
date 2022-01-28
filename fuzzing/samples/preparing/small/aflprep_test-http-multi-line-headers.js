'use strict';
const assert = require('assert');
const http = require('http');
const net = require('net');
const server = net.createServer(function(conn) {
  const body = 'Yet another node.js server.';
  const response =
      'Connection: close\r\n' +
      `Content-Length: ${body.length}\r\n` +
      ' x-unix-mode=0600;\r\n' +
      ' name="hello.txt"\r\n' +
      '\r\n' +
      body;
  conn.end(response);
  server.close();
});
server.listen(0, common.mustCall(function() {
  http.get({
    host: '127.0.0.1',
    port: this.address().port
  }, common.mustCall(function(res) {
    assert.strictEqual(res.headers['content-type'],
    res.destroy();
  }));
}));
