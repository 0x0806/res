'use strict';
const assert = require('assert');
const { createServer } = require('http');
const { createConnection } = require('net');
const server = createServer();
server.on('connection', mustCall((socket) => {
  socket.on('error', expectsError({
    name: 'Error',
    message: 'Parse Error: Invalid method encountered',
    code: 'HPE_INVALID_METHOD',
    bytesParsed: 1,
  }));
}));
server.listen(0, () => {
  const chunks = [];
  const socket = createConnection({
    allowHalfOpen: true,
    port: server.address().port
  });
  socket.on('connect', mustCall(() => {
  }));
  socket.on('data', (chunk) => {
    chunks.push(chunk);
  });
  socket.on('end', mustCall(() => {
    const expected = Buffer.from(
    );
    assert(Buffer.concat(chunks).equals(expected));
    server.close();
  }));
});
