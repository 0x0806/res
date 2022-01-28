'use strict';
const assert = require('assert');
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
socket.bind(0);
socket.on('listening', common.mustCall(() => {
  const result = socket.setMulticastTTL(16);
  assert.strictEqual(result, 16);
  assert.throws(() => {
    socket.setMulticastTTL(1000);
  assert.throws(() => {
    socket.setMulticastTTL('foo');
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: 'The "ttl" argument must be of type number. Received type string' +
             " ('foo')"
  });
  socket.close();
}));
