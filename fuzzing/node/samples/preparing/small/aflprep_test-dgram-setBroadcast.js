'use strict';
const assert = require('assert');
const dgram = require('dgram');
{
  const socket = dgram.createSocket('udp4');
  assert.throws(() => {
    socket.setBroadcast(true);
}
{
  const socket = dgram.createSocket('udp4');
  socket.bind(0, common.mustCall(() => {
    socket.setBroadcast(true);
    socket.setBroadcast(false);
    socket.close();
  }));
}
