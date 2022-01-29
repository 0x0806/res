'use strict';
const assert = require('assert');
const dgram = require('dgram');
const socket_ipv4 = dgram.createSocket('udp4');
socket_ipv4.on('listening', common.mustNotCall());
socket_ipv4.on('error', common.mustCall(function(e) {
  assert.strictEqual(e.port, undefined);
  assert.strictEqual(e.message, 'bind EADDRNOTAVAIL 1.1.1.1');
  assert.strictEqual(e.address, '1.1.1.1');
  assert.strictEqual(e.code, 'EADDRNOTAVAIL');
  socket_ipv4.close();
}));
socket_ipv4.bind(0, '1.1.1.1');
const socket_ipv6 = dgram.createSocket('udp6');
socket_ipv6.on('listening', common.mustNotCall());
socket_ipv6.on('error', common.mustCall(function(e) {
  const allowed = ['EADDRNOTAVAIL', 'EAFNOSUPPORT', 'EPROTONOSUPPORT'];
  assert(allowed.includes(e.code), `'${e.code}' was not one of ${allowed}.`);
  assert.strictEqual(e.port, undefined);
  assert.strictEqual(e.message, `bind ${e.code} 111::1`);
  assert.strictEqual(e.address, '111::1');
  socket_ipv6.close();
}));
socket_ipv6.bind(0, '111::1');
