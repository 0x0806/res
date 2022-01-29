'use strict';
const assert = require('assert');
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
socket.on('listening', common.mustCall(() => {
  assert.throws(() => {
    socket.bind();
  }, {
    code: 'ERR_SOCKET_ALREADY_BOUND',
    name: 'Error',
  });
  socket.close();
}));
