'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const net = require('net');
const connect = net.connect;
net.connect = common.mustCall((...args) => {
  assert.strictEqual(args[0].port, '80');
  return connect(...args);
});
client.on('error', () => {});
client.close();
