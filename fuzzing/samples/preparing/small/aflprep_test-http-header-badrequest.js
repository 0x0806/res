'use strict';
const assert = require('assert');
const { createServer } = require('http');
const { createConnection } = require('net');
const server = createServer();
server.on('request', mustCall((req, res) => {
  res.write('asd', () => {
    res.socket.emit('error', new Error('kaboom'));
  });
}));
server.listen(0, mustCall(() => {
  const c = createConnection(server.address().port);
  let received = '';
  c.on('connect', mustCall(() => {
  }));
  c.on('data', mustCall((data) => {
    received += data.toString();
  }));
  c.on('end', mustCall(() => {
    assert.strictEqual(received.indexOf('asd\r\n'), received.length - 5);
    c.end();
  }));
  c.on('close', mustCall(() => server.close()));
}));
