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
function writeRequest(socket, withBody) {
  if (withBody) {
    socket.write('Connection: keep-alive\r\n');
    socket.write(`Content-Length: ${bodySent.length}\r\n\r\n`);
    socket.write(`${bodySent}\r\n`);
    socket.write('\r\n\r\n');
  } else {
    socket.write('Connection: keep-alive\r\n');
    socket.write('\r\n\r\n');
  }
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
function initialRequests(socket, numberOfRequests, cb) {
  let buffer = '';
  writeRequest(socket);
  socket.on('data', (data) => {
    buffer += data;
    if (buffer.endsWith('\r\n\r\n')) {
      if (--numberOfRequests === 0) {
        socket.removeAllListeners('data');
        cb();
      } else {
        const [headers, body] = buffer.trim().split('\r\n\r\n');
        assertResponse(headers, body);
        buffer = '';
        writeRequest(socket, true);
      }
    }
  });
}
server.maxRequestsPerSocket = 3;
server.listen(0, common.mustCall((res) => {
  const socket = new net.Socket();
  const anotherSocket = new net.Socket();
  socket.on('end', common.mustCall(() => {
    server.close();
  }));
  socket.on('ready', common.mustCall(() => {
    initialRequests(socket, 2, common.mustCall(() => {
      anotherSocket.connect({ port: server.address().port });
    }));
  }));
  anotherSocket.on('ready', common.mustCall(() => {
    initialRequests(anotherSocket, 2, common.mustCall(() => {
      let buffer = '';
      socket.on('data', common.mustCall((data) => {
        buffer += data;
        if (buffer.endsWith('\r\n\r\n')) {
          const [headers, body] = buffer.trim().split('\r\n\r\n');
          assertResponse(headers, body, true);
          anotherSocket.end();
          socket.end();
        }
      }));
      writeRequest(socket, true);
    }));
  }));
  socket.connect({ port: server.address().port });
}));
