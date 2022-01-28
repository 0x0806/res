'use strict';
const net = require('net');
const assert = require('assert');
const N = 20;
let disconnectCount = 0;
const c = net.createConnection(common.PORT);
c.on('connect', common.mustNotCall('client should not have connected'));
c.on('error', common.mustCall((e) => {
  assert.strictEqual(e.code, 'ECONNREFUSED');
}, N + 1));
c.on('close', common.mustCall(() => {
  if (disconnectCount++ < N)
}, N + 1));
