'use strict';
const net = require('net');
const assert = require('assert');
const socket = new net.Socket();
socket.setTimeout(common.platformTimeout(50));
socket.on('timeout', common.mustCall(() => {
  assert.strictEqual(socket._handle, null);
}));
socket.on('connect', common.mustNotCall());
setTimeout(() => {}, common.platformTimeout(200));
