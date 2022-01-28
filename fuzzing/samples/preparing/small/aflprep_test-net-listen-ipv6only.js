'use strict';
if (!common.hasIPv6)
  common.skip('no IPv6 support');
const assert = require('assert');
const net = require('net');
const host = '::';
const server = net.createServer();
server.listen({
  host,
  port: 0,
  ipv6Only: true,
}, common.mustCall(() => {
  const { port } = server.address();
  const socket = net.connect({
    host: '0.0.0.0',
    port,
  });
  socket.on('connect', common.mustNotCall());
  socket.on('error', common.mustCall((err) => {
    assert.strictEqual(err.code, 'ECONNREFUSED');
    server.close();
  }));
}));
