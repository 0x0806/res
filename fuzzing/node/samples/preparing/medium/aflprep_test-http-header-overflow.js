'use strict';
const assert = require('assert');
const { createServer, maxHeaderSize } = require('http');
const { createConnection } = require('net');
const CRLF = '\r\n';
const DUMMY_HEADER_NAME = 'Cookie: ';
const DUMMY_HEADER_VALUE = 'a'.repeat(
  maxHeaderSize - DUMMY_HEADER_NAME.length - (2 * CRLF.length) + 1
);
const PAYLOAD = PAYLOAD_GET + CRLF +
  DUMMY_HEADER_NAME + DUMMY_HEADER_VALUE + CRLF.repeat(2);
const server = createServer();
server.on('connection', mustCall((socket) => {
  const legacy = getOptionValue('--http-parser') === 'legacy';
  socket.on('error', expectsError({
    name: 'Error',
    message: 'Parse Error: Header overflow',
    code: 'HPE_HEADER_OVERFLOW',
    bytesParsed: maxHeaderSize + PAYLOAD_GET.length - (legacy ? -1 : 0),
    rawPacket: Buffer.from(PAYLOAD)
  }));
}));
server.listen(0, mustCall(() => {
  const c = createConnection(server.address().port);
  let received = '';
  c.on('connect', mustCall(() => {
    c.write(PAYLOAD);
  }));
  c.on('data', mustCall((data) => {
    received += data.toString();
  }));
  c.on('end', mustCall(() => {
    assert.strictEqual(
      received,
      'Connection: close\r\n\r\n'
    );
    c.end();
  }));
  c.on('close', mustCall(() => server.close()));
}));
