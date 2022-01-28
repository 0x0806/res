'use strict';
const net = require('net');
const http = require('http');
const assert = require('assert');
const bodySent = 'This is my request';
function assertResponse(headers, body, expectClosed) {
  if (expectClosed) {
  } else {
  }
}
function writeRequest(socket) {
  socket.write('Connection: keep-alive\r\n');
  socket.write(`Content-Length: ${bodySent.length}\r\n\r\n`);
  socket.write(`${bodySent}\r\n`);
  socket.write('\r\n\r\n');
}
const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', () => {
    if (req.method === 'POST') {
      assert.strictEqual(bodySent, body);
    }
    res.write('Hello World!');
    res.end();
  });
});
server.maxRequestsPerSocket = 3;
server.listen(0, common.mustCall((res) => {
  const socket = new net.Socket();
  socket.on('end', common.mustCall(() => {
    server.close();
  }));
  socket.on('ready', common.mustCall(() => {
    writeRequest(socket);
    writeRequest(socket);
    writeRequest(socket);
    writeRequest(socket);
  }));
  let buffer = '';
  socket.on('data', (data) => {
    buffer += data;
    const responseParts = buffer.trim().split('\r\n\r\n');
    if (responseParts.length === 8) {
      assertResponse(responseParts[0], responseParts[1]);
      assertResponse(responseParts[2], responseParts[3]);
      assertResponse(responseParts[4], responseParts[5], true);
      socket.end();
    }
  });
  socket.connect({ port: server.address().port });
}));
