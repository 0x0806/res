'use strict';
const assert = require('assert');
const net = require('net');
const host = '*'.repeat(64);
const errCodes = ['ENOTFOUND', 'EAI_FAIL'];
const socket = net.connect(42, host, common.mustNotCall());
socket.on('error', common.mustCall(function(err) {
  assert(errCodes.includes(err.code), err);
}));
socket.on('lookup', common.mustCall(function(err, ip, type) {
  assert(err instanceof Error);
  assert(errCodes.includes(err.code), err);
  assert.strictEqual(ip, undefined);
  assert.strictEqual(type, undefined);
}));
