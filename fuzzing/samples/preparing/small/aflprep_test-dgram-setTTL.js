'use strict';
const assert = require('assert');
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
socket.bind(0);
socket.on('listening', common.mustCall(() => {
  const result = socket.setTTL(16);
  assert.strictEqual(result, 16);
  assert.throws(() => {
    socket.setTTL('foo');
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: 'The "ttl" argument must be of type number. Received type string' +
             " ('foo')"
  });
  assert.throws(() => {
    socket.setTTL(1000);
  socket.close();
}));
