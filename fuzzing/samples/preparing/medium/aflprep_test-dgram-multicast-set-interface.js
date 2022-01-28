'use strict';
const assert = require('assert');
const dgram = require('dgram');
{
  const socket = dgram.createSocket('udp4');
  socket.bind(0);
  socket.on('listening', common.mustCall(() => {
    socket.setMulticastInterface('0.0.0.0');
    socket.close();
  }));
}
{
  const socket = dgram.createSocket('udp4');
  socket.bind(0);
  socket.on('listening', common.mustCall(() => {
    socket.close(common.mustCall(() => {
      assert.throws(() => { socket.setMulticastInterface('0.0.0.0'); },
    }));
  }));
}
{
  const socket = dgram.createSocket('udp4');
  socket.bind(0);
  socket.on('listening', common.mustCall(() => {
    try {
      socket.setMulticastInterface('::');
    } catch (e) {
      assert(e.code === 'EINVAL' || e.code === 'ENOPROTOOPT');
    }
    socket.close();
  }));
}
{
  const socket = dgram.createSocket('udp4');
  socket.bind(0);
  socket.on('listening', common.mustCall(() => {
    assert.throws(() => {
      socket.setMulticastInterface(1);
    socket.close();
  }));
}
{
  const socket = dgram.createSocket('udp4');
  socket.bind(0);
  socket.on('listening', common.mustCall(() => {
    assert.throws(() => {
      socket.setMulticastInterface('224.0.0.2');
    socket.close();
  }));
}
if (!common.hasIPv6)
  return;
{
  const socket = dgram.createSocket('udp6');
  socket.bind(0);
  socket.on('listening', common.mustCall(() => {
    assert.throws(() => {
      socket.setMulticastInterface(String(undefined));
    socket.close();
  }));
}
{
  const socket = dgram.createSocket('udp6');
  socket.bind(0);
  socket.on('listening', common.mustCall(() => {
    assert.throws(() => {
      socket.setMulticastInterface('');
    socket.close();
  }));
}
{
  const socket = dgram.createSocket('udp6');
  socket.bind(0);
  socket.on('listening', common.mustCall(() => {
    socket.setMulticastInterface('::%lo0');
    socket.close();
  }));
}
