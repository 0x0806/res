'use strict';
const assert = require('assert');
const dgram = require('dgram');
{
  const socket = dgram.createSocket('udp4');
  assert.throws(() => {
    socket.setMulticastLoopback(16);
}
{
  const socket = dgram.createSocket('udp4');
  socket.bind(0);
  socket.on('listening', common.mustCall(() => {
    assert.strictEqual(socket.setMulticastLoopback(16), 16);
    assert.strictEqual(socket.setMulticastLoopback(0), 0);
    socket.close();
  }));
}
