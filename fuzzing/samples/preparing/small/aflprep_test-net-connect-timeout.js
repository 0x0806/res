'use strict';
const net = require('net');
const assert = require('assert');
const start = new Date();
const T = 100;
const socket = net.createConnection(9999, '192.0.2.1');
socket.setTimeout(T);
socket.on('timeout', common.mustCall(function() {
  console.error('timeout');
  const now = new Date();
  assert.ok(now - start < T + 500);
  socket.destroy();
}));
socket.on('connect', common.mustNotCall());
