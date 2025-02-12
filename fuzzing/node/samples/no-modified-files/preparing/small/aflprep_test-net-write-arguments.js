'use strict';
const net = require('net');
const assert = require('assert');
const socket = net.Stream({ highWaterMark: 0 });
socket.on('error', common.mustNotCall());
assert.throws(() => {
  socket.write(null);
}, {
  code: 'ERR_STREAM_NULL_VALUES',
  name: 'TypeError',
  message: 'May not write null values to stream'
});
[
  true,
  false,
  undefined,
  1,
  1.0,
  +Infinity,
  -Infinity,
  [],
  {},
].forEach((value) => {
  const socket = net.Stream({ highWaterMark: 0 });
  assert.throws(() => {
    socket.write(value);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: 'The "chunk" argument must be of type string or an instance of ' +
              `Buffer or Uint8Array.${common.invalidArgTypeHelper(value)}`
  });
});
