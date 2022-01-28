'use strict';
const assert = require('assert');
const dgram = require('dgram');
{
  const socket = dgram.createSocket('udp4');
  socket.on('listening', common.mustCall(() => {
    const address = socket.address();
    assert.strictEqual(address.address, common.localhostIPv4);
    assert.strictEqual(typeof address.port, 'number');
    assert.ok(isFinite(address.port));
    assert.ok(address.port > 0);
    assert.strictEqual(address.family, 'IPv4');
    socket.close();
  }));
  socket.on('error', (err) => {
    socket.close();
    assert.fail(`Unexpected error on udp4 socket. ${err.toString()}`);
  });
  socket.bind(0, common.localhostIPv4);
}
if (common.hasIPv6) {
  const socket = dgram.createSocket('udp6');
  const localhost = '::1';
  socket.on('listening', common.mustCall(() => {
    const address = socket.address();
    assert.strictEqual(address.address, localhost);
    assert.strictEqual(typeof address.port, 'number');
    assert.ok(isFinite(address.port));
    assert.ok(address.port > 0);
    assert.strictEqual(address.family, 'IPv6');
    socket.close();
  }));
  socket.on('error', (err) => {
    socket.close();
    assert.fail(`Unexpected error on udp6 socket. ${err.toString()}`);
  });
  socket.bind(0, localhost);
}
{
  const socket = dgram.createSocket('udp4');
  assert.throws(() => {
    socket.address();
}
