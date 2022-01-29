'use strict';
const assert = require('assert');
const http = require('http');
const net = require('net');
const body = 'hello world\r\n';
const fullResponse =
    `Content-Length: ${body.length}\r\n` +
    'Date: Fri + 18 Feb 2011 06:22:45 GMT\r\n' +
    'Host: 10.20.149.2\r\n' +
    'Access-Control-Allow-Credentials: true\r\n' +
    '\r\n' +
    body;
const server = net.createServer(function(socket) {
  let postBody = '';
  socket.setEncoding('utf8');
  socket.on('data', function(chunk) {
    postBody += chunk;
    if (postBody.includes('\r\n')) {
      socket.write(fullResponse);
      socket.end(fullResponse);
    }
  });
  socket.on('error', function(err) {
    assert.strictEqual(err.code, 'ECONNRESET');
  });
});
server.listen(0, common.mustCall(function() {
  http.get({ port: this.address().port }, common.mustCall(function(res) {
    let buffer = '';
    console.log(`Got res code: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      buffer += chunk;
    });
    res.on('end', common.mustCall(function() {
      console.log(`Response ended, read ${buffer.length} bytes`);
      assert.strictEqual(body, buffer);
      server.close();
    }));
  }));
}));
